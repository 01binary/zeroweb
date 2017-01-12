/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that displays a single OBJ model
|        with edge toggle & turn-table control.
|  @requires ../external/three.js
|  @requires ../external/OBJLoader.js
|  @requires ../external/OrbitControls.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register model directive.
 */
angular.module('zeroApp')
    .directive('model', [ '$q', '$http', 'render2d', modelDirective ]);

/**
 * Implement model directive.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $render2d - The rendering service.
 */
function modelDirective($q, $http, $render2d) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<canvas></canvas>',
        scope: {},
        link: function($scope, $element, attributes) {
            var noLogo = attributes['nologo'];
            var noTexture = attributes['notexture'];
            var noMaterial = attributes['nomaterial'];
            var materialColor = attributes['color'] || '#FFFFFF';
            var edgesColor = attributes['edgecolor'] || '#888888';
            var small = attributes['small'] || true;
            var alignLeft = attributes['left'];
            var alignRight = attributes['right']
            var portrait = attributes['portrait'] || true;
            var square = attributes['square'] || false;
            var elem = $element.get(0);
            var classSuffix = small ? 'small' : 'large';
            
            if (square) {
                $element.addClass('square-3d-' + classSuffix);
            } else if (portrait) {
                $element.addClass('portrait-3d-' + classSuffix);
            }

            if (alignLeft) {
                $element.addClass('align-left');
            } else if (alignRight) {
                $element.addClass('align-right');
            }

            if (attributes['random']) {
                showRandom3dModel($q, $http, $scope, elem, noLogo, noTexture, noMaterial, materialColor, edgesColor);
            } else {
                var project = attributes['project'];
                var part = attributes['part'];

                show3dModel($q, $http, $scope, elem, project, part, noLogo, noTexture, noMaterial, materialColor, edgesColor);
            }
        }
    };
}

/**
 * Display a rotating model with edge visualization and turn-table controls.
 * @param {object} $q - The Angular promise service.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $scope - The directive scope.
 * @param {object} canvas - The WebGL canvas.
 * @param {string} project - The string identifying a sub-directory of '/projects' to load the model files from.
 * @param {string} part - The string identifying a common name of supporting files to load.
 * @param {bool} noLogo - Whether to skip loading and showing a logo graphic while loading the main model.
 * @param {bool} noTexture - Whether to fill the model with a solid color (unlit) without loading the texture.
 * @param {bool} noMaterial - Whether to show only model wire frame edges.
 * @param {number} materialColor - When used with noTexture, fills with specified color (hex number).
 * @param {number} edgesColor - Color to use for rendering wireframe edges.
 * @returns - Promise indicating the loading has completed but receiving nothing.
 */ 
function show3dModel($q, $http, $scope, canvas, project, part, noLogo, noTexture, noMaterial, materialColor, edgesColor) {
    return $q(function(resolve) {
        $scope.scene = new THREE.Scene();
        $scope.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true
        });

        $scope.width = canvas.clientWidth;
        $scope.height = canvas.clientHeight;
        $scope.renderer.setPixelRatio(window.devicePixelRatio);
        $scope.renderer.setSize($scope.width, $scope.height);
        $scope.renderer.autoClear = false;

        var modelBaseUrl = '/models/' + project + '/' + part;

        loadLogo($q, $scope, noLogo).then(function(logoModel) {
            var aspect = $scope.width / $scope.height;
            
            if (!noLogo) {
                $scope.logo = logoModel;
                $scope.logoScene = new THREE.Scene();
                $scope.logoScene.add($scope.logo);
                $scope.logoScene.add($scope.logoEdges);
                
                var ld = $scope.width / 8;

                $scope.logoCamera = new THREE.OrthographicCamera(
                    -ld * aspect,
                    ld * aspect,
                    ld,
                    -ld,
                    0.001,
                    1000);

                $scope.logoCamera.position.z = -60;
                $scope.logoCamera.lookAt($scope.logo.position);
            }

            animate($scope);

            $q.all(
            [
                loadModelMetadata($http, $scope, modelBaseUrl + '.json'),
                loadModelTexture($q, $scope, modelBaseUrl + '.png', noTexture),
                loadModel($q, $scope, modelBaseUrl + '.obj', materialColor)
                
            ]).then(function() {
                if (!noTexture) {
                    $scope.mesh.material.map = $scope.texture;
                }

                $scope.edges = new THREE.EdgesHelper(
                    $scope.mesh,
                    edgesColor ? edgesColor : 0xbbbbbb,
                    $scope.edgesAngle);
                
                $scope.scene.add($scope.model);
                $scope.scene.add($scope.edges);
                
                if (noMaterial) {
                    $scope.model.visible = false;
                }

                var bounds = new THREE.Box3().setFromObject($scope.model);
                var d = $scope.width / $scope.cameraDistanceScale * 1.5;

                $scope.model.rotation.setFromVector3($scope.baseRotation.multiplyScalar(Math.PI));

                $scope.camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
                $scope.camera.position.z = (bounds.max.z - bounds.min.z) * $scope.cameraDistanceScale;
                $scope.camera.lookAt($scope.model.position);

                var orbit = new THREE.OrbitControls($scope.camera, $scope.renderer.domElement);
                orbit.addEventListener('change', function() { $scope.freeze = Date.now(); });
                orbit.enableDamping = true;
                orbit.dampingFactor = 0.25;
                orbit.enableZoom = false;
                
                $scope.done = true;
            });
        });
        
        resolve();
    });
}

/**
 * Load and show a random model.
 * @param {object} $q - The Angular Promise service.
 * @param {object} $http - The The Angular AJAX service.
 * @param {object} $scope - The directive scope.
 * @param {object} canvas - The webGL canvas.
 * @param {bool} noLogo - Whether to disable loading and displaying a logo while loading the main model.
 * @param {bool} noTexture - Whether to disable loading and rendering a texture on the model.
 * @param {bool} noMaterial - Whether to render a filled mesh for the model to prevent seeing wireframe edges on the other side.
 * @param {number} materialColor - When used with noTexture controls mesh fill color.
 * @param {number} edgesColor - color to use for wireframe edges.
 * @returns - A promise indicating when loading has completed but receiving no arguments.
 */
function showRandom3dModel($q, $http, $scope, canvas, noLogo, noTexture, noMaterial, materialColor, edgesColor) {
    var projectName = null;
    var partName = null;
    
    return $http({
        url: '../models/list.json'

    }).then(function(response) {
        var randomProjectId = Math.random() * (response.length - 1);
        var randomPartId = Math.random() * (response[randomProjectId].parts.length - 1);
        
        projectName = response[randomProjectId].name;
        partName = response[randomProjectId].parts[randomPartId];
        
    }).then(function() {
        return show3dModel(
            $q,
            $http,
            $scope,
            canvas,
            projectName,
            partName,
            noLogo,
            noTexture,
            noMaterial,
            materialColor,
            edgesColor);
    });
}

/**
 * Setup and perform continuous rendering.
 * @param {object} $scope - The directive scope.
 */
function animate($scope) {
    // Request the next frame.
    requestAnimationFrame(function() {
        animate($scope)
    });

    // Clear the canvas.
    $scope.renderer.clear();

    // Render the model if fully loaded.
    if ($scope.camera) {
        $scope.renderer.render($scope.scene, $scope.camera);

        if (!$scope.freeze || (Date.now() - $scope.freeze) > 1000.0) {
            $scope.model.rotateOnAxis($scope.displayRotationAxis, 0.01);
        }
    }

    // Render spinning logo until the model loads.
    if (!$scope.done && $scope.logo) {
        $scope.logo.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.07);

        if ($scope.camera) {
            $scope.renderer.clear(false, true, true);
        }

        $scope.renderer.render($scope.logoScene, $scope.logoCamera);
    }
}

/**
 * Load the metadata used to render and spin the model.
 * @param {object} $http - The Angular AJAX service.
 * @param {object} $scope - The directive scope.
 * @param {string} url - The url to load metadata .json from using AJAX request.
 * @returns - A promise indicating when loading has completed.
 */
function loadModelMetadata($http, $scope, url) {
    return $http({ url: url }).then(function(response) {
        var metadata = response.data;

        $scope.baseRotation = new THREE.Vector3(
            metadata.baseRotationX,
            metadata.baseRotationY,
            metadata.baseRotationZ);

        $scope.displayRotationAxis = new THREE.Vector3(
            metadata.displayRotationAxisX,
            metadata.displayRotationAxisY,
            metadata.displayRotationAxisZ);

        $scope.cameraDistanceScale = metadata.cameraDistanceScale;
        $scope.edgesAngle = metadata.edgesAngle;
    });
}

/**
 * Load the model texture from an image URL.
 * @param {object} $q - The Angular Promise service.
 * @param {object} $scope - The directive scope.
 * @param {string} url - The url to load the texture from, preferring .png format.
 * @param {bool} disable - Whether to skip loading the texture and return a resolved promise.
 * @returns - A promise that receives the loaded texture.
 */
function loadModelTexture($q, $scope, url, disable) {
    return $q(function(resolve) {
        if (!disable) {
            var loader = new THREE.ImageLoader();

            loader.load(url, function(image) {
                $scope.texture = new THREE.Texture();
                $scope.texture.image = image;
                $scope.texture.needsUpdate = true;

                resolve($scope.texture);
            });
        } else {
            resolve(null);
        }
    });
}

/**
 * Loads a model in OBJ format from the specified URL.
 * @param {object} $q - The Angular promise service.
 * @param {object} $scope - The directive scope.
 * @param {string} url - The url to load the model form.
 * @param {number} materialColor - The color (hex number) to use for the unlit material.
 * @returns - A promise that receives the loaded model.
 */
function loadModel($q, $scope, url, materialColor) {
    return $q(function(resolve) {
        var loader = new THREE.OBJLoader();

        loader.load(url, function(object) {
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    if (materialColor == null) {
                        child.material = new THREE.MeshBasicMaterial();
                    } else {
                        child.material = new THREE.MeshBasicMaterial({
                            color: new THREE.Color(materialColor)
                        });
                    }
                    
                    $scope.mesh = child;
                }
            });

            $scope.model = object;
            resolve(object);

        });
    });
}

/**
 * Load a logo model from a hard-coded path and set up edges helper for outlining the model.
 * @param {object} $q - The Angular promise service.
 * @param {object} $scope - The directive scope.
 * @param {bool} disable - Whether to return an empty promise that does nothing.
 * @returns - A promise that receives the loaded logo model or null if disable is set to true.
 */
function loadLogo($q, $scope, disable) {
    return $q(function(resolve) {
        if (disable) {
            resolve(null);
        } else {
            var loader = new THREE.OBJLoader();

            loader.load('/models/shared/logo.obj', function(object) {
                object.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = new THREE.MultiMaterial([
                            new THREE.MeshBasicMaterial({color:0x12c0e1, side:THREE.DoubleSide}),
                            new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide})
                        ]);

                        $scope.logoEdges = new THREE.EdgesHelper(child, 0xbbbbbb, 10);

                        resolve(child);
                    }
                });
            });
        }
    });
}