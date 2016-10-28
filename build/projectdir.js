/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Ensure current directory is project directory.
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var cwd = process.cwd();
var elements = cwd.split('/');
var leaf = elements[elements.length - 1];

if (leaf !== 'src') {
    if (leaf === '.vscode') {
        process.chdir('../src');
    } else {
        process.chdir('src');
    }
}