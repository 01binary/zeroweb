/*--------------------------------------------------------*\
|  ██████   ██  |
|  ██  ██   ██  |
|  ██  ██   ██  |
|  ██████   ██  |  binary : tech art
|
|  About page and filterable online CV.
|----------------------------------------------------------
|  Copyright(C) 2021 Valeriy Novytskyy
\*---------------------------------------------------------*/

import React, { FC } from 'react';
import { graphql } from 'gatsby';
import Page, { PageQuery } from '../components/Page';
import HelloAnimation from '../components/Animations/HelloAnimation';
import CurrentExperienceIcon from '../images/cv-current-experience.svg';
import PreviousExperienceIcon from '../images/cv-past-experience.svg';
import EducationIcon from '../images/cv-education.svg';
import CertificationsIcon from '../images/cv-certifications.svg';
import InterestsIcon from '../images/cv-interests.svg';
import { ButtonResources } from '../components/Button';
import {
  Sidebar,
  Story,
  Title,
  Company,
  Dates,
  Location,
  Summary,
  Details,
  Keywords,
  Contact,
  SocialLinks,
  Experience,
  Stack,
  Hero,
} from '../components/Story/Story';

const About: FC<PageQuery> = ({ data }) => (
  <Page
    maxWidth="900px"
    {...{
      data: {
        ...data,
        page: {
          slug: 'about',
          frontmatter: {
            title: 'About',
            seoTitle: 'Valeriy Novytskyy - technical leader',
            description: 'Online resume',
            collection: 'about',
          },
          fields: {
            url: '/about',
          },
        },
      },
    }}
  >
    <ButtonResources />

    <Sidebar>
      <SocialLinks
        userName="Valeriy Novytskyy"
        linkedin="https://www.linkedin.com/in/valeriy-n-2967487"
        stack_overflow="https://stackoverflow.com/users/3727395/valeriy-novytskyy"
        github="https://github.com/01binary"
      />
    </Sidebar>

    <HelloAnimation />

    <Hero tight>Hi there,</Hero>

    <Hero>
      I use my passion for `engineering` and `design` to build sustainable
      products that stand out.
    </Hero>

    <Hero>
      Follow my adventures in `software development`, `industrial design` and
      `robotics` on this blog!
    </Hero>

    <Contact />

    <Story>
      <Experience>
        <CurrentExperienceIcon />
        <Title>Senior Frontend Engineer</Title>
        <Company>
          [Tandem Diabetes
          Care](https://www.linkedin.com/company/tandemdiabetes/mycompany/verification/)
        </Company>
        <Dates>Mar 2021 – Present</Dates>
        <Location>Remote</Location>
        <Stack>
          typescript, react, material ui, docker, styled components, storybook
        </Stack>
        <Summary>
          <p>
            Applying `functional programming` principles with `React` and
            `Typescript` to `empower` health care providers with accurate
            `clinical insights` and `create` better care `outcomes` for patients
            with Diabetes.
          </p>
          <p>
            Delivering practical solutions with clear value by growing a deep
            understanding of the business domain and defining technical stories.
          </p>
          <p>
            Growing `team capacity` by proposing and making software
            `architecture` and `design` improvements to deliver features faster
            and secure our position as a market leader.
          </p>
          <p>
            Developing engineers to `maximize contributions` from the `unique
            talents` on my team. Teaching `software development` and
            `architecture` best practices across teams.
          </p>
        </Summary>
        <Details>
          <p>
            Applying `functional programming` principles with `React`, `React
            Native`, and `Typescript` to `empower` health care providers with
            accurate `clinical insights` and `create` better care `outcomes` for
            patients with Diabetes.
          </p>
          <p>
            Unlocking extra `scaling` potential by leveraging `Service Workers`
            and `Web Sockets` to shift costly data processing onto the client.
          </p>
          <p>
            Growing `team capacity` by exposing and fixing critical quality
            issues to `deliver` features faster and `secure` our position as a
            market leader.
          </p>
          <p>
            Delivering `practical solutions` with clear value by growing a `deep
            understanding` of the business domain and sharing expertise to
            `maximize` contributions from the `unique talents` on my team.
          </p>
          <p>
            Working with the backend team and `DevOps` to maintain features
            supported by stateless `microservices`, databases, and desktop
            applications communicating over a variety of channels including `Web
            Sockets` with `SignalR`, `REST` API, `GraphQL` API, and `USB`
            hardware.
          </p>
          <p>
            Localizing application text using `i18n` libraries and browser
            `Internalization` (`Intl`) API.
          </p>
          <p>
            Maintaining suites of integration tests with `Jest` and `Testing
            Library`.
          </p>
        </Details>
        <Keywords>
          agile, scrum, technical writing, node.js, jira, bitbucket, github,
          scalable vector graphics, expo, representational state transfer,
          eslint, mobile, mui
        </Keywords>
      </Experience>

      <Experience>
        <PreviousExperienceIcon />
        <Title>Enterprise Architect</Title>
        <Company>
          [CorVel
          Corporation](https://www.linkedin.com/company/corvel-corporation/)
        </Company>
        <Dates>Oct 2019 – Feb 2021</Dates>
        <Location>Portland OR</Location>
        <Stack>
          azure, asp.net core, kubernetes, angular, sql server, azure machine
          learning
        </Stack>
        <Summary>
          <p>
            Supported `enterprise application development` across multiple
            teams. Shifted common responsibilities like `authentication` to
            `automated` cloud infrastructure to facilitate efficient delivery.
          </p>
          <p>
            Led a weekly `architecture` meeting to amplify best practices for
            working with `Azure` services, `ASP.NET Core` backend, `Angular 8`
            frontend, and `SQL Server` databases.
          </p>
          <p>
            Worked with `DevOps`, developers and `QA` to create a new `Software
            Development Lifecycle` process and migrate applications to the new
            cloud infrastructure.
          </p>
        </Summary>
        <Details>
          <p>
            Planned `ARM template` deployment of `API Management` for
            token-based authentication across all APIs and `App Gateway` for
            path-based routing across all apps to expedite moving the most
            important line of business products to the cloud and `shift` common
            responsibilities like authentication onto `automated
            infrastructure`.
          </p>
          <p>
            Led a weekly `architecture` meeting to communicate best practices
            for working with `Azure Cloud`, `Azure DevOps`, `ASP.NET Core`
            backend, `Angular 8` frontend, and `SQL Server` databases.
          </p>
          <p>
            Worked with `DevOps`, developers and `QA` to create a new `Software
            Development Lifecycle` process and migrate applications to the new
            cloud infrastructure.
          </p>
          <p>
            Developed `architectural standards` and `shared libraries` for App
            Configuration, REST API, Service Bus, Path-based Routing,
            Application Insights, Azure Artifacts, N-tier architecture, `Entity
            Framework` and `Dapper` ORM, Cookie and Token-based authentication,
            Health Checks, and CORS.
          </p>
        </Details>
        <Keywords>
          leadership, technical writing, apim, sdl, angularjs, software
          architect, transact-sql, representational state transfer
        </Keywords>
      </Experience>

      <Experience>
        <PreviousExperienceIcon />
        <Title>Senior Software Development Engineer</Title>
        <Company>
          [Zapproved](https://www.linkedin.com/company/zapproved/)
        </Company>
        <Dates>Mar 2019 – Oct 2019</Dates>
        <Location>Portland OR</Location>
        <Stack>aws, google cloud, asp.net core, terraform, sql server</Stack>
        <Summary>
          <p>
            Directed an effort to integrate a `vertical slice` of an application
            used to preserve `legal documents` with `Google Cloud` platform to
            unlock new business opportunities and onboard a major customer.
          </p>
          <p>
            Served on the `Architecture` board and co-authored proposals to grow
            software development expertise and establish standards.
          </p>
        </Summary>
        <Details>
          <p>
            Maintained a cloud-based litigation system for corporate law
            consisting of `ASP.NET Core` backend and `Angular` frontend, hosted
            in `Amazon Web Services`. The cloud service used `Step Functions` to
            maintain long-running workflows, `Lambdas` to execute actions,
            `DynamoDB` databases, and `Elastic Beanstalk` for hosting services.
          </p>
          <p>
            Directed an effort to integrate a `vertical slice` of a legacy
            codebase with `Google Cloud` API and Identity Platform to onboard a
            major customer that was using Google Suite to store documents.
            Created a `project plan` based on research, worked with a `scrum
            master` to create Jira stories and with a `product owner` to write
            requirements in `Gherkin` format.
          </p>
          <p>
            Defined a `working agreement` to hire a team of contractors and
            provided technical direction for completing the project.
          </p>
          <p>
            Proposed strategies to increase `scalability` and `maintainability`
            of the service while fielding a steady stream of support requests
            and adding critical features that helped sell the product.
          </p>
          <p>
            Served on the Architecture board and co-authored development
            patterns and proposals to improve the software development process
            throughout the company.
          </p>
        </Details>
        <Keywords>
          leadership, technical writing, agile, sdl, software development
          lifecycle, solution architect, jira, bitbucket
        </Keywords>
      </Experience>

      <Experience>
        <PreviousExperienceIcon />
        <Title>Senior Frontend Developer</Title>
        <Company>
          [WebMD Health
          Services](https://www.linkedin.com/company/webmd-health-services/)
        </Company>
        <Dates>Dec 2017 – Mar 2019</Dates>
        <Location>Portland OR</Location>
        <Stack>
          javascript, asp.net mvc, react, material ui, jest, storybook
        </Stack>
        <Summary>
          <p>
            Led a `team` of near-shore contractors to `integrate` a new product
            positioned to re-vitalize the company with legacy `authentication`
            system and `monolith` services that generated health data
            `insights`.
          </p>
          <p>
            Unlocked additional `scaling capacity` for the business by
            standardizing custom `login` and `registration` business rules that
            enabled health plan participants to log into WebMD applications from
            their respective health providers.
          </p>
        </Summary>
        <Details>
          <p>
            Architected a new `login`, `single sign-on`, and `registration
            system` for a suite of health tracking applications using `OAuth`
            bearer token authentication.
          </p>
          <p>
            `Researched` and `documented` the behavior of the legacy system to
            find opportunities for integration, organized the project plan into
            `stories` and `epics`, and defined `milestones` to help
            engineering/project managers `schedule`, `prioritize`, and `track`
            project tasks each sprint.
          </p>
          <p>
            Led a team of `on-site developers` and two teams of `nearshore
            contractors` to complete minimum viable product using `ASP.NET`
            backend, and `Node.js`/`React.js` frontend.
          </p>
          <p>
            Leveraged `Recompose` to express application behaviors using a
            compact `functional programming` syntax to `control complexity` and
            separate `cross-cutting concerns`.
          </p>
          <p>
            Performed accessibility testing and reviews to ensure web
            applications meet W3C `WCAG` requirements for text contrast and the
            correct `aria` attributes are present on relevant UI elements to
            allow screen readers to announce static and dynamic content
            correctly.
          </p>
          <p>
            Helped define new strategies for functional programming with `Ramda`
            and `Recompose` and migrate from `Redux`.
          </p>
          <p>
            Performed `code reviews` for in-house and near-share teams and
            worked on migrating older `Babel` projects to `TypeScript`.
          </p>
          <p>
            Coordinated across teams to expose and consume `APIs` from various
            `business domains`.
          </p>
          <p>
            Published a package with reusable application components based on
            `Material UI` that implemented a `style system` consistent with
            `branding guidelines` established by the creative department.
          </p>
          <p>
            Created a `Storybook.js` showcase containing `components`, `styles`,
            `colors`, and `icons` used in the style system.
          </p>
          <p>
            Deployed `Node.js` applications with `express.js` middleware and
            `server-side rendering` (SSR) to enable integration with
            company-branded styles and behaviors, such as requesting `user
            information` from multiple `REST` endpoints to compose the `initial
            application state` payload for React.
          </p>
          <p>
            Created and maintained `Yeoman` templates used to `scaffold` new
            Node.js/React.js applications that fit IT and business requirements.
          </p>
        </Details>
        <Keywords>
          leader, asp.net, mvc, propose, proposal, legacy, agile, scrum, web
          content accessibility guidelines, jira, bitbucket, nuget, continuous
          integration, ci, eslint, nunit
        </Keywords>
      </Experience>

      <Experience>
        <PreviousExperienceIcon />
        <Title>Senior Software Development Engineer</Title>
        <Company>
          [SoftSource
          Consulting](https://www.linkedin.com/company/softsource-consulting/)
        </Company>
        <Dates>Sep 2016 – Dec 2017</Dates>
        <Location>Portland OR</Location>
        <Stack>asp.net mvc, react, redux, less</Stack>
        <Summary>
          <p>
            Engaged `WebMD` to re-assert their brand equity with health plans by
            delivering a responsive `React`/`Redux` application that
            incentivized cheaper `insurance` costs by `rewarding` subscribers
            for maintaining a healthy lifestyle.
          </p>
          <p>
            Assisted in a `strategic push` to unlock `scaling capacity` for the
            business by migrating monolith `ASP.NET` applications to stateless
            `microservices` and `standardize` customer-specific business rules.
          </p>
        </Summary>
        <Details>
          <p>
            Engaged `WebMD` re-assert their brand equity with health plans by
            delivering a responsive `React`/`Redux` application that
            incentivized cheaper `insurance` costs for employees by rewarding
            them for managing conditions with healthy eating, exercise, taking
            medications on time, regular provider visits, and frequent
            notifications to help them stay on track.
          </p>
          <p>
            Delivered features at a regular cadence with `Agile`/`Scrum` by
            creating `Jira` stories and `Bitbucket` pull requests.
          </p>
          <p>
            Styled application interface with `SCSS` and object oriented CSS
            (`OOCSS`) by referencing UX compositions in `Sketch` and importing
            `SVG` graphics.
          </p>
          <p>
            Used `CSS animations` and `dynamic` SVG rendering to increase user
            engagement by creating interactive and data-driven visualizations.
          </p>
          <p>
            Created `i18n` and text substitution components to support rendering
            localized text personalized for each customer health plan.
          </p>
          <p>
            Integrated a UI `tour`/`walkthrough` solution to highlight important
            functionality to new users.
          </p>
          <p>
            Worked with UX designers and other frontend developers to create the
            first version of style guide and `design system` using `LESS` styles
            which was published as an `npm` package.
          </p>
          <p>
            Consumed and created internal `APIs` for managing health `goal
            tracking` data and `user information`.
          </p>
          <p>
            Practiced `Test Driven Development` by writing tests for `React`
            components and `express.js` middleware utilizing `Jest`,
            `Supertest`, and `Rewire` for mocking dependencies. Achieved near
            100% `unit test coverage` setup with `Istanbul`.
          </p>
          <p>
            Deployed `Node.js` applications with `express.js` middleware and
            `server-side rendering` (SSR) to enable integration with
            company-branded styles and behaviors, such as requesting `user
            information` from multiple `REST` endpoints to compose the `initial
            application state` payload for React.
          </p>
          <p>
            Maintained `Webpack` configuration that split application bundles
            and reported on bundle contents using the `Bundle Analyzer` plugin
            to control application size.
          </p>
        </Details>
        <Keywords>
          ajax, scalable vector graphics, web forms, continuous integration, ci,
          eslint, tdd, mui
        </Keywords>
      </Experience>

      <Experience>
        <PreviousExperienceIcon />
        <Title>Software Development Engineer</Title>
        <Company>
          [Experis Game
          Solutions](https://www.linkedin.com/company/experis-game-solutions/)
        </Company>
        <Dates>Jul 2011 – Sep 2016</Dates>
        <Location>Tigard OR</Location>
        <Stack>c#, c++, xbox platform, directx, azure, sql server</Stack>
        <Summary>
          <p>
            Helped the business increase their `competitive advantage` by
            expanding the service offering to include `Azure` cloud development,
            instrumenting digital products on the newest `Xbox One` platform,
            and developing advanced `quality assurance tools`.
          </p>
          <p>
            Engaged `Microsoft` to launch a `social gaming platform` that
            monetized player engagement and ran on a `DirectX` port of `Windows
            Presentation Foundation` integrated with `Unreal` engine.
          </p>
          <p>
            Increased `organization capacity` of Microsoft Game Test
            Organization to support more internal customers by adding
            `self-service` functionality to the most popular quality assurance
            tools.
          </p>
        </Summary>
        <Details>
          <p>
            Instrumented digital products written in `C++` and published on
            `Xbox One`, `Universal App` and `Windows` platforms: Gears of War,
            State of Decay, Spelunky, Dust: An Elysian Trail and [many
            others](https://www.mobygames.com/developer/sheet/view/developerId,510722/).
          </p>
          <p>
            Analyzed `Direct3D` performance with `PIX` and debugged vertex &amp;
            pixel shaders with ATI `RenderMonkey` and NVidia `fxComposer` tools.
          </p>
          <p>
            Developed interactive data visualizations in `C#` and `WPF` with
            `Model View - View Model` pattern and `Unity Application Block`
            dependency injection framework to help troubleshoot and manipulate
            `distributed services`.
          </p>
          <p>
            Designed and maintained `Azure Table Storage` and `SQL Server`
            databases. Optimized query performance by assessing `execution
            plans` and data unit (`DTU`) charts to identify expensive operations
            and create indexes.
          </p>
          <p>
            Supported a `distributed` crash reporting system in `Azure` that
            used `Debugging Tools for Windows` from Windows `Platform SDK` to
            perform crash dump analysis and automatically file tickets in `Jira`
            and `Team Foundation Server` issue tracking systems.
          </p>
          <p>
            Developed a portal used to collect data from test automation tools
            using `Angular` and `Bootstrap`.
          </p>
          <p>
            Provided `support` and `maintenance` for open-source cross-platform
            libraries published to `NuGet` feed and reviewed with `CodeFlow` to
            help others create automation tools.
          </p>
          <p>
            Enabled testers to record, modify, and play back Xbox `controller
            inputs` on multiple machines using a MIDI track-like editing
            interface with individual samples manipulated by mouse; since
            adopted by the `Xbox One` platform team.
          </p>
          <p>
            Developed an automated build verification system using `Windows
            Workflow Foundation` that emailed rich HTML reports transformed via
            `XSLT`, with game-specific tests designed by dragging &amp; dropping
            in a visual editor.
          </p>
          <p>
            Worked with Microsoft `Team Foundation Server`, `Perforce`, and
            Apache `Subversion` repositories.
          </p>
          <p>
            Wrote `unit` &amp; `functional` tests for continuous build
            integration using the `Mock` framework, `Rhino Mocks`, and `XUnit`.
          </p>
          <p>
            Created and maintained `technical documentation`, integrated `HTML
            Help`, and topics generated with `Sandcastle` from source comments.
          </p>
          <p>
            Gave `training presentations` to internal customers with handouts
            and sample code to follow along.
          </p>
          <p>
            Developed test report processing and visualization utilities in
            `Microsoft Excel` and `Microsoft Access` using Visual Basic for
            Applications (`VBA`) to enable test engineering leaders to focus on
            high-leverage activities.
          </p>
        </Details>
        <Keywords>svn, tfs, wpf, wf, mvvm, transact-sql, direct3d, ci</Keywords>
      </Experience>

      <Experience>
        <PreviousExperienceIcon />
        <Title>Web and Print Designer</Title>
        <Company>
          [Unisource
          Manufacturing](https://www.linkedin.com/company/unisource-manufacturing/)
        </Company>
        <Dates>Nov 2006 – Jul 2011</Dates>
        <Location>Portland OR</Location>
        <Stack>jquery, sharepoint, indesign, photoshop, illustrator, c++</Stack>
        <Summary>
          <p>
            Created `content-driven` sites with `SharePoint` and `jQuery` to
            reach more customers without engaging an expensive creative agency.
          </p>
          <p>
            Developed a `C` database application that helped customers select
            products and enabled the business to win against competitors that
            employed software engineering teams.
          </p>
          <p>
            Designed catalogs and other marketing materials in `Adobe Creative
            Suite` to help the business compete against companies with dedicated
            graphic design departments.
          </p>
        </Summary>
        <Details>
          <p>
            Used `SharePoint` and `jQuery` to create content-driven sites that
            helped the business reach more customers as sales were moving online
            while avoiding engagements with expensive creative agencies.
          </p>
          <p>
            Developed a stand-alone `C` database application with `Pelles C`
            IDE, distributed on CDs, to help customers select the right products
            by calculating and searching product specifications. This enabled
            the company to compete against businesses that employed software
            engineering teams and owned Visual Studio licenses.
          </p>
          <p>
            Developed data processing utilities in `Microsoft Excel` using
            `Visual Basic for Applications` to save key stakeholders in the
            company hours of time, freeing up their creativity and domain
            expertise for high-leverage tasks.
          </p>
          <p>
            Designed and typeset catalogs and other marketing materials with
            Adobe `InDesign` and worked with vendors to print large projects on
            digital, 4- and 5-color printing presses to compete against
            companies with dedicated graphic design departments.
          </p>
          <p>
            Created technical illustrations with `Illustrator`, directed
            `product photography`, and prepared images for printing with
            `Photoshop`.
          </p>
        </Details>
        <Keywords>ajax</Keywords>
      </Experience>

      <Experience>
        <EducationIcon />
        <Title>Associate of Applied Science in IT &amp; Multimedia</Title>
        <Company>
          [ITT Technical Institute](https://www.facebook.com/ITTTech/)
        </Company>
        <Dates>Aug 2006 – Mar 2008</Dates>
        <Location>Portland OR</Location>
        <Stack>
          c#, aftereffects, premiere, illustrator, 3d studio max, autodesk
          inventor
        </Stack>
        <Summary>
          Studied software development, graphic design, illustration, video
          production, web design, computer-aided drafting and 3D rendering.
        </Summary>
        <Details>
          <p>
            Graduated with a `4.0 GPA` for going the extra mile on creative
            projects and assisting other students.
          </p>
          <p>
            Studied software development with `Visual C#`, graphic design,
            animation, video production, and illustration with `Adobe Creative
            Suite`, web design with Microsoft `FrontPage`, computer aided
            drafting with `Autodesk Inventor`, CG rendering with `3D Studio Max`
            and `Blender`.
          </p>
          <p>
            Programmed a rigid body physics engine with spring constraints in
            `C++`, and built `Windows` applications that rendered real-time
            hardware-accelerated 3D graphics with `Direct3D`.
          </p>
          <p>
            Developed tools and utilities in `C`/`C++` with Microsoft Foundation
            Classes (`MFC`) and Active Template Library (`ATL`). Utilized
            `Visual Basic` for Rapid Development (`RAD`) of rich Windows
            applications with custom `ActiveX` controls.
          </p>
        </Details>
        <Keywords>adobe, activex, cad</Keywords>
      </Experience>

      <Experience>
        <CertificationsIcon />
        <Title single>Certifications</Title>
        <Summary>
          <p>
            [70-486 Developing ASP.NET MVC Web
            Applications](https://www.microsoft.com/en-us/learning/exam-70-486.aspx)
          </p>
          <p>
            [AWS Cloud Solution
            Architecture](https://aws.amazon.com/certification/certified-solutions-architect-associate/)
          </p>
        </Summary>
      </Experience>

      <Experience>
        <InterestsIcon />
        <Title single>Interests</Title>
        <Summary>
          <p>
            Robotics with [ROS](https://www.ros.org/), embedded `C++`
            development on `Raspberry Pi` and `Arduino`, industrial design with
            `Autodesk Inventor`.
          </p>
          <p>
            Graphic design, animation and video production with `Adobe Creative
            Suite`, music production with `Ableton Live`.
          </p>
        </Summary>
        <Keywords>robot operating system, ros, ableton live</Keywords>
      </Experience>
    </Story>
  </Page>
);

export default About;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        url
      }
    }
  }
`;
