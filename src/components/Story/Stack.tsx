import React, { FC, useContext, useMemo, useEffect, useCallback } from 'react';
import { HexButton, HexList } from '../HexList';
import { StackSection } from './Story.styles';
import StoryContext from './StoryContext';
import JSIcon from '../../images/tool-js.svg';
import TSIcon from '../../images/tool-ts.svg';
import CSIcon from '../../images/tool-cs.svg';
import CppIcon from '../../images/tool-cpp.svg';
import ReactIcon from '../../images/tool-react.svg';
import MuiIcon from '../../images/tool-mui.svg';
import AzureIcon from '../../images/tool-azure.svg';
import AwsIcon from '../../images/tool-aws.svg';
import MaxIcon from '../../images/tool-3dsmax.svg';
import ReduxIcon from '../../images/tool-redux.svg';
import SPIcon from '../../images/tool-sharepoint.svg';
import JQueryIcon from '../../images/tool-jquery.svg';
import AngularIcon from '../../images/tool-angular.svg';
import InventorIcon from '../../images/tool-inventor.svg';
import PremiereIcon from '../../images/tool-premiere.svg';
import InDesignIcon from '../../images/tool-indesign.svg';
import AspNetMvcIcon from '../../images/tool-aspnetmvc.svg';
import SqlServerIcon from '../../images/tool-sqlserver.svg';
import PhotoshopIcon from '../../images/tool-photoshop.svg';
import AspNetCoreIcon from '../../images/tool-aspnetcore.svg';
import IllustratorIcon from '../../images/tool-illustrator.svg';
import GoogleCloudIcon from '../../images/tool-googlecloud.svg';
import StyledComponentsIcon from '../../images/tool-styledcomponents.svg';
import AfterEffectsIcon from '../../images/tool-aftereffects.svg';
import XboxPlatformIcon from '../../images/tool-xboxplatform.svg';
import KubernetesIcon from '../../images/tool-kubernetes.svg';
import DirectXIcon from '../../images/tool-directx.svg';
import TerraformIcon from '../../images/tool-terraform.svg';
import StorybookIcon from '../../images/tool-storybook.svg';
import AzureMLIcon from '../../images/tool-azureml.svg';
import DockerIcon from '../../images/tool-docker.svg';
import LessIcon from '../../images/tool-less.svg';
import JestIcon from '../../images/tool-jest.svg';
import ExperienceContext from './ExperienceContext';

const STACK_ICONS: Record<string, JSX.Element> = {
  javascript: JSIcon,
  typescript: TSIcon,
  react: ReactIcon,
  redux: ReduxIcon,
  'material ui': MuiIcon,
  azure: AzureIcon,
  'asp.net core': AspNetCoreIcon,
  angular: AngularIcon,
  'sql server': SqlServerIcon,
  aws: AwsIcon,
  'google cloud': GoogleCloudIcon,
  'asp.net mvc': AspNetMvcIcon,
  jest: JestIcon,
  jquery: JQueryIcon,
  sharepoint: SPIcon,
  indesign: InDesignIcon,
  photoshop: PhotoshopIcon,
  illustrator: IllustratorIcon,
  'c#': CSIcon,
  'c++': CppIcon,
  aftereffects: AfterEffectsIcon,
  premiere: PremiereIcon,
  '3d studio max': MaxIcon,
  'autodesk inventor': InventorIcon,
  'xbox platform': XboxPlatformIcon,
  directx: DirectXIcon,
  kubernetes: KubernetesIcon,
  'azure machine learning': AzureMLIcon,
  docker: DockerIcon,
  'styled components': StyledComponentsIcon,
  less: LessIcon,
  terraform: TerraformIcon,
  storybook: StorybookIcon,
};

const Stack: FC = ({ children }) => {
  const { showTipFor, hideTip, setFilter } = useContext(StoryContext);
  const { setStack } = useContext(ExperienceContext);
  const keywords = useMemo(
    () =>
      children
        .toString()
        .toLowerCase()
        .split(',')
        .map((k) => k.trim()),
    [children]
  );

  useEffect(() => {
    setStack(keywords);
  }, [keywords, setStack]);

  return (
    <StackSection>
      <HexList>
        {keywords.map((text, index) => (
          <HexButton
            key={`tag${index}`}
            index={index}
            icon={STACK_ICONS[text] || JSIcon}
            tooltip={text}
            showTipFor={showTipFor}
            hideTip={hideTip}
            onClick={() =>
              setFilter(
                (filter) => `${filter ?? ''}${filter ? ' ' : ''}${text}`
              )
            }
          />
        ))}
      </HexList>
    </StackSection>
  );
};

export default Stack;
