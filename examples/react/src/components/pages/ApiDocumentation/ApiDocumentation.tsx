import type { ReactElement } from 'react';
import Heading from '../../atoms/Heading/Heading';
import { Paragraph } from '../../atoms/Paragraph/Paragraph';
import { CodeBlock } from '../../organisms/CodeBlock/CodeBlock';
import { Section } from '../../organisms/Section/Section';
import { importCodeBlock } from './ApiDocumentation.data';
import { StyledApiDocumentation } from './ApiDocumentation.styles';
import { HeadingType } from '../../atoms/Heading/Heading.data';

export default function ApiDocumentation(): ReactElement {
  return (
    <StyledApiDocumentation>
      <Section>
        <Heading as={HeadingType.H2}>API Documentation</Heading>

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>

        <CodeBlock value={importCodeBlock} />

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>
      </Section>

      <Section>
        <Heading as={HeadingType.H3}>useTransitionController()</Heading>

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>
      </Section>

      <Section>
        <Heading as={HeadingType.H4}>useEnterTransition()</Heading>

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>
      </Section>

      <Section>
        <Heading as={HeadingType.H3}>Transitions on conditional rendering</Heading>

        <Heading as={HeadingType.H4}>{'<TransitionPresence />'}</Heading>

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>
      </Section>

      <Section>
        <Heading as={HeadingType.H4}>useLeaveTransition()</Heading>

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>
      </Section>

      <Section>
        <Heading as={HeadingType.H4}>{'<TransitionRouter />'}</Heading>

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>

        <Heading as={HeadingType.H4}>{'<TransitionRoute />'}</Heading>

        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam tempore beatae laboriosam
          magnam voluptatibus, amet doloribus quaerat libero quibusdam iure dolore ab facere
          veritatis illum sit. Sed similique incidunt perspiciatis.
        </Paragraph>
      </Section>
    </StyledApiDocumentation>
  );
}
