import React, {
  FC,
  ReactNode,
  createContext,
  useState,
  useContext,
  useCallback,
  ChangeEvent,
  useEffect,
  useMemo,
} from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { HexButton, HexList } from '../HexList';
import ClearIcon from '../../images/cancel.svg';
import JSIcon from '../../images/tool-js.svg';
import TSIcon from '../../images/tool-ts.svg';
import CSIcon from '../../images/tool-cs.svg';
import CppIcon from '../../images/tool-cpp.svg';
import ReactIcon from '../../images/tool-react.svg';
import MuiIcon from '../../images/tool-mui.svg';
import AzureIcon from '../../images/tool-azure.svg';
import AspNetMvcIcon from '../../images/tool-aspnetmvc.svg';
import AspNetCoreIcon from '../../images/tool-aspnetcore.svg';
import AngularIcon from '../../images/tool-angular.svg';
import SqlServerIcon from '../../images/tool-sqlserver.svg';
import AwsIcon from '../../images/tool-aws.svg';
import GoogleCloudIcon from '../../images/tool-googlecloud.svg';
import ReduxIcon from '../../images/tool-redux.svg';
import JQueryIcon from '../../images/tool-jquery.svg';
import SPIcon from '../../images/tool-sharepoint.svg';
import PhotoshopIcon from '../../images/tool-photoshop.svg';
import InDesignIcon from '../../images/tool-indesign.svg';
import IllustratorIcon from '../../images/tool-illustrator.svg';
import MaxIcon from '../../images/tool-3dsmax.svg';
import InventorIcon from '../../images/tool-inventor.svg';
import PremiereIcon from '../../images/tool-premiere.svg';
import AfterEffectsIcon from '../../images/tool-aftereffects.svg';
import XboxPlatformIcon from '../../images/tool-xboxplatform.svg';
import DirectXIcon from '../../images/tool-directx.svg';
import KubernetesIcon from '../../images/tool-kubernetes.svg';
import AzureMLIcon from '../../images/tool-azureml.svg';
import DockerIcon from '../../images/tool-docker.svg';
import StyledComponentsIcon from '../../images/tool-styledcomponents.svg';
import TerraformIcon from '../../images/tool-terraform.svg';
import LessIcon from '../../images/tool-less.svg';
import JestIcon from '../../images/tool-jest.svg';
import StorybookIcon from '../../images/tool-storybook.svg';
import Button, { ButtonResources } from '../Button';
import { Arrow, Tooltip } from '../Tooltip';
import LinkButton from '../LinkButton';
import {
  HideTipHandler,
  ShowTipForHandler,
  useTooltip,
} from '../../hooks/useTooltip';
import { openUrl } from '../../utils';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import {
  CompanySection,
  ContactSection,
  DetailsSection,
  ExperienceCard,
  ExperienceTimeline,
  FilterButton,
  FilterIndicator,
  FilterInput,
  FilterSection,
  Heading,
  HeroSection,
  InlineContactButton,
  MoreSection,
  StackSection,
  StorySection,
  SummarySection,
} from './Story.styles';
export { Sidebar, Location, Dates } from './Story.styles';

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

type ExperienceState = {
  title: string;
  company: string;
  summary: string;
  details: string;
  stack: string[];
  keywords: string[];
};

type ExperienceContextProps = {
  showDetails: boolean;
  details: string;
  setTitle(title: string): void;
  setCompany(company: string): void;
  setSummary(summary: string): void;
  setDetails(details: string): void;
  setStack(stack: string[]): void;
  setKeywords(keywords: string[]): void;
  toggleDetails(): void;
};

type StoryState = {
  filter?: string;
  setFilter(filter: string): void;
  showTipFor: ShowTipForHandler;
  hideTip: HideTipHandler;
};

const StoryContext = createContext<StoryState>({
  setFilter: () => {},
  showTipFor: () => {},
  hideTip: () => {},
});

const ExperienceContext = createContext<Partial<ExperienceContextProps>>({});

const PARAGRAPH_SEPARATOR = '\r\n\r\n';

const filterParagraph = ({ type }: ReactElement) => type === 'p';

const mapParagraph = ({
  props: { children },
}: {
  props: Record<string, string>;
}) => children;

const getMarkdown = (children: ReactNode) =>
  Array.isArray(children)
    ? (children as ReactElement[])
        .filter(filterParagraph)
        .map(mapParagraph)
        .join(PARAGRAPH_SEPARATOR)
    : children.toString();

const trimPattern = (pattern: string) =>
  pattern.replace(/^\,\.\w/g, '').replace(/\,\.\w$/g, '');

const notEmptyPattern = (pattern: string) => pattern.length > 0;

const filterMatch = (
  { title, summary, details, stack, keywords }: Partial<ExperienceState>,
  filter: string
) => {
  return filter
    .split(' ')
    .filter(notEmptyPattern)
    .map(trimPattern)
    .reduce((matches, token) => {
      const matchesTitle = title?.indexOf(token) >= 0;
      const matchesSummary = summary?.indexOf(token) >= 0;
      const matchesDetails = details?.indexOf(token) >= 0;
      const matchesStack =
        stack?.filter((key) => key.indexOf(token) >= 0)?.length > 0;
      const matchesKeywords =
        keywords?.filter((key) => key.indexOf(token) >= 0)?.length > 0;

      return (
        matches ||
        matchesTitle ||
        matchesSummary ||
        matchesDetails ||
        matchesStack ||
        matchesKeywords
      );
    }, false);
};

const ContactButton: FC<{ inline?: boolean }> = ({ inline }) => {
  const handleContact = useCallback(
    () =>
      openUrl('mailto:', {
        to: [['valeriy', 'novytskyy'].join('.'), 'outlook.com'].join('@'),
      }),
    []
  );
  return inline ? (
    <InlineContactButton shared onClick={handleContact}>
      Contact Me
    </InlineContactButton>
  ) : (
    <ContactSection>
      <Button shared onClick={handleContact}>
        Contact Me
      </Button>
    </ContactSection>
  );
};

export const Contact: FC = () => <ContactButton />;

export const Filter: FC = () => {
  const { filter, setFilter } = useContext(StoryContext);

  const handleChangeFilter = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value),
    [setFilter]
  );

  const handleClearFilter = useCallback(() => setFilter(undefined), [
    setFilter,
  ]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => e.key === 'Escape' && handleClearFilter(),
    [handleClearFilter]
  );

  return (
    <FilterSection>
      <FilterInput
        value={filter ?? ''}
        onChange={handleChangeFilter}
        onKeyDown={handleKeyDown}
        placeholder="filter skills &amp; experience"
      />
      <FilterIndicator />
      <FilterButton onClick={handleClearFilter}>
        <ClearIcon />
      </FilterButton>
      <ContactButton inline />
    </FilterSection>
  );
};

export const Story: FC = ({ children }) => {
  const [filter, setFilter] = useState<string | undefined>();
  const { showTipFor, hideTip, tipProps, tipRef, tooltipText } = useTooltip({
    verticalOffsetDesktop: 10,
    verticalOffsetMobile: 5,
    placement: 'top',
  });

  return (
    <StoryContext.Provider
      value={{
        filter,
        setFilter,
        showTipFor,
        hideTip,
      }}
    >
      <StorySection>
        <Filter />
        {children}
        <Tooltip ref={tipRef} {...tipProps}>
          {tooltipText}
          <Arrow />
        </Tooltip>
      </StorySection>
    </StoryContext.Provider>
  );
};

export const CurrentExperienceIcon: FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <line
      className="fill-none stroke-border"
      stroke-width="0.85"
      stroke-miterlimit="10"
      x1="16.6"
      y1="31"
      x2="35.8"
      y2="22"
    />

    <rect
      x="15.3"
      y="19.1"
      transform="matrix(0.9063 -0.4226 0.4226 0.9063 -5.901 12.9512)"
      className="fill-border"
      width="21.9"
      height="1.4"
    />
    <polygon
      className="fill-border"
      points="17,38.3 15.7,38.3 15.7,24.8 11.7,21.9 12.5,20.8 16.7,23.8 17,24.4"
    />
    <rect
      x="20.3"
      y="15.4"
      transform="matrix(0.9063 -0.4226 0.4226 0.9063 -4.6287 11.3486)"
      width="6"
      height="1.4"
    />
    <polygon points="16.6,38.9 15.9,38.8 11.7,35.7 11.4,35.2 11.4,21.3 11.8,20.7 18.4,17.6 19,18.9 12.8,21.8 12.8,34.8 16.4,37.5 35.5,28.6 35.5,15.5 31.9,12.9 27.9,14.7 27.3,13.5 31.6,11.5 32.3,11.5 36.6,14.6 36.9,15.2 36.9,29 36.5,29.6 	" />
    <polygon
      className="fill-background--medium"
      points="18.6,13.3 18.3,13.9 18.3,18.8 19.6,19.2 21.2,18.5 21.4,17.9 21.4,15 25.3,13.2 25.3,16.1 26.1,16.4 27.7,15.6 28,15.1 27.9,10.1 26.9,9.5 	"
    />
    <polygon points="27.2,9.4 18.6,13.3 18.2,13.9 18.2,19.3 19.6,19.3 19.6,14.4 26.8,11.1 26.9,16 28.2,15.4 28.1,10" />
    <circle
      className="stroke-focus"
      fill="none"
      stroke-width="2.5"
      cx="24"
      cy="24"
      r="22"
    />
  </svg>
);

export const PreviousExperienceIcon: FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <circle
      className="fill-none stroke-border"
      stroke-width="2.5"
      cx="24"
      cy="24"
      r="8.9"
    />
  </svg>
);

export const EducationIcon: FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <circle
      className="fill-none stroke-success"
      stroke-width="2.5"
      cx="24"
      cy="24"
      r="22"
    />
    <g stroke-width="1.5">
      <polygon
        id="cap"
        className="stroke-foreground fill-opaque"
        stroke-miterlimit="10"
        points="39.7,24.5 24.1,13 8.6,24.5 17.1,30.9 31.2,30.8 "
      />
      <ellipse
        id="hole"
        className="fill-background--light"
        cx="24.1"
        cy="30.9"
        rx="6.9"
        ry="4.3"
      />
      <path
        className="fill-none stroke-foreground"
        stroke-miterlimit="10"
        d="M20.4,33.4"
      />
      <path
        className="fill-opaque stroke-foreground"
        stroke-miterlimit="10"
        d="M8.6,24.5"
      />
      <path
        className="fill-none stroke-foreground"
        stroke-miterlimit="10"
        d="M10.5,25.8c0,0-1.6,1.9-1.6,3.8v4.5"
      />
      <path
        className="fill-none stroke-foreground"
        stroke-miterlimit="10"
        d="M17.3,30.6c0,2.6,3.1,4.7,6.9,4.7s6.9-2.1,6.9-4.7"
      />
      <path
        id="side"
        fill="none"
        stroke="#898989"
        stroke-miterlimit="10"
        d="M17.3,31.4c0-2.6,3.1-4.7,6.9-4.7s6.9,2.1,6.9,4.7v-5.1c0-2.6-3.1-4.7-6.9-4.7s-6.9,2.1-6.9,4.7V31.4z"
      />
    </g>
  </svg>
);

export const CertificationsIcon: FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <circle
      className="fill-none stroke-alternate"
      stroke-width="2.5"
      cx="24"
      cy="24"
      r="22"
    />
    <polygon className="fill-border" points="16.5,8 31.5,8 29.1,14 17.7,14 " />
    <polygon
      className="fill-border"
      points="29.8,23.8 36.2,13.7 31.5,8 25,21.7 27.3,22.3 "
    />
    <polygon
      className="fill-background"
      points="18.2,23.8 11.8,13.7 16.5,8 23.2,21.9 20.7,22.2 "
    />
    <rect
      x="16.7"
      y="9.9"
      className="fill-background--light"
      width="14.1"
      height="2.7"
    />
    <polygon
      className="fill-background--light"
      points="34.9,12.2 28.5,23 26.4,22 32.9,9.7 "
    />
    <polygon
      className="fill-background--light"
      points="13.1,12.2 19.5,23 21.6,22 15.1,9.7 "
    />

    <circle
      className="stroke-opaque fill-background--light"
      stroke-width="1.5"
      stroke-miterlimit="10"
      cx="24"
      cy="30.7"
      r="7.5"
    />
    <path
      className="fill-foreground"
      d="M24,22.8c4.4,0,7.9,3.5,7.9,7.9s-3.5,7.9-7.9,7.9s-7.9-3.5-7.9-7.9S19.6,22.8,24,22.8 M24,21.3
  c-5.2,0-9.4,4.2-9.4,9.4S18.8,40,24,40s9.4-4.2,9.4-9.4S29.2,21.3,24,21.3L24,21.3z"
    />
    <rect x="22.1" y="29.2" className="fill-border" width="1.4" height="3.1" />
    <rect x="24.3" y="29.2" className="fill-border" width="1.4" height="3.1" />
  </svg>
);

export const InterestsIcon: FC = () => (
  <svg width="48" height="48" viewBox="0 0 48 48">
    <circle
      className="fill-none stroke-focus"
      stroke-width="2.5"
      cx="24"
      cy="24"
      r="22"
    />
    <path
      className="fill-none stroke-foreground"
      stroke-miterlimit="10"
      stroke-width="1.5"
      d="M24.1,17.4c0,0,2-3.4,5.7-3.2s6.2,2.8,6.8,5.3
	c0.7,2.5-0.4,4.6-0.4,4.6s-1.2,2.7-4,5.3s-8.1,6.5-8.1,6.5h-0.1c0,0-5.3-3.9-8.1-6.5s-4-5.3-4-5.3s-1.1-2.1-0.4-4.6s3.1-5.1,6.8-5.3
	s5.7,3.2,5.7,3.2H24.1z"
    />
  </svg>
);

export const Experience: FC = ({ children }) => {
  const { filter } = useContext(StoryContext);
  const [experience, setExperience] = useState<Partial<ExperienceState>>({});
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const toggleDetails = useCallback(() => setShowDetails((show) => !show), [
    setShowDetails,
  ]);

  const setTitle = useCallback(
    (title: string) => setExperience((xp) => ({ ...xp, title })),
    [setExperience]
  );

  const setCompany = useCallback(
    (company: string) => setExperience((xp) => ({ ...xp, company })),
    [setExperience]
  );

  const setSummary = useCallback(
    (summary: string) => setExperience((xp) => ({ ...xp, summary })),
    [setExperience]
  );

  const setDetails = useCallback(
    (details: string) => setExperience((xp) => ({ ...xp, details })),
    [setExperience]
  );

  const setStack = useCallback(
    (stack: string[]) => setExperience((xp) => ({ ...xp, stack })),
    [setExperience]
  );

  const setKeywords = useCallback(
    (keywords: string[]) =>
      setExperience((experience) => ({ ...experience, keywords })),
    [setExperience]
  );

  const isMatch = !filter || filterMatch(experience, filter);

  return isMatch ? (
    <ExperienceCard>
      <ExperienceTimeline />
      <ExperienceContext.Provider
        value={{
          setTitle,
          setCompany,
          setSummary,
          setDetails,
          setStack,
          setKeywords,
          toggleDetails,
          showDetails,
          details: experience.details,
        }}
      >
        {children}
      </ExperienceContext.Provider>
    </ExperienceCard>
  ) : null;
};

export const Title: FC<{ single?: true }> = ({ single, children }) => {
  const { setTitle } = useContext(ExperienceContext);

  useEffect(() => {
    setTitle(children.toString().toLowerCase());
  }, [children, setTitle]);

  return <Heading single={single}>{children}</Heading>;
};

export const Company: FC = ({ children }) => {
  const { setCompany } = useContext(ExperienceContext);
  const markdown = useMemo(() => getMarkdown(children), [children]);

  useEffect(() => {
    setCompany(markdown.toLowerCase());
  }, [children, setCompany]);

  return (
    <CompanySection>
      <ReactMarkdown linkTarget="_blank">{markdown}</ReactMarkdown>
    </CompanySection>
  );
};

export const Summary: FC = ({ children }) => {
  const { setSummary, details, showDetails, toggleDetails } = useContext(
    ExperienceContext
  );

  const summary = useMemo(() => getMarkdown(children), [children]);
  const hasMore = details && details.length;

  useEffect(() => {
    setSummary(summary.toLowerCase());
  }, [children, setSummary]);

  return (
    <SummarySection>
      <ReactMarkdown linkTarget="_blank">
        {showDetails ? details : summary}
      </ReactMarkdown>
      {hasMore && (
        <MoreSection>
          <LinkButton onClick={toggleDetails}>
            {showDetails ? 'less' : 'more...'}
          </LinkButton>
        </MoreSection>
      )}
    </SummarySection>
  );
};

export const Details: FC = ({ children }) => {
  const { setDetails } = useContext(ExperienceContext);
  const details = useMemo(() => getMarkdown(children), [children]);

  useEffect(() => {
    setDetails(details);
  }, [children, setDetails]);

  return <DetailsSection>{children}</DetailsSection>;
};

export const Stack: FC = ({ children }) => {
  const { showTipFor, hideTip } = useContext(StoryContext);
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
          />
        ))}
      </HexList>
    </StackSection>
  );
};

const KeywordsSection = styled.section`
  display: none;
`;

export const Keywords: FC = ({ children }) => {
  const { setKeywords } = useContext(ExperienceContext);
  const keywords = useMemo(
    () =>
      children
        .toString()
        .split(',')
        .map((k) => k.trim()),
    [children]
  );

  useEffect(() => {
    setKeywords(keywords);
  }, [keywords, setKeywords]);

  return <KeywordsSection>{children}</KeywordsSection>;
};

export const Hero: FC<{ tight?: boolean }> = ({ tight, children }) => (
  <HeroSection tight={tight}>
    <ReactMarkdown linkTarget="_blank">{getMarkdown(children)}</ReactMarkdown>
  </HeroSection>
);
