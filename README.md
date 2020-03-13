# react-multi-step

## Install

```
npm install final-form react-final-form react-multi-step
```

<p align="center">
    <img src='https://raw.githubusercontent.com/remorses/react-multi-step/master/.github/video.gif' >
</p>

## Usage Example

Check out the exmple folder for an up to date example

```tsx
import React from 'react'
import { Wizard, WizardStepProps } from '../src'
import { Field, useField } from 'react-final-form'
import {
    Box,
    CSSReset,
    ThemeProvider,
    InputProps,
    Input,
    Button,
    Text,
    Stack,
    Flex,
} from '@chakra-ui/core'

const App = () => {
    return (
        <ThemeProvider>
            <CSSReset />
            <Wizard Wrapper={Wrapper}>
                <Step0 />
                <Step1 />
                <Step2 />
                <Step3 />
                <Step4 hideFromHistory />
            </Wizard>
        </ThemeProvider>
    )
}

const Step0 = ({ next }: WizardStepProps) => {
    return (
        <Stack spacing={4} flex='1' justify='center' align='center'>
            <Text fontSize='48px'>Begin the step form</Text>
            <Text opacity={0.5} fontSize='24px'>
                to test this awesome react component
            </Text>
            <Box flex='1' />
            <Button onClick={next}>brgin</Button>
        </Stack>
    )
}

const Step1 = ({ next }: WizardStepProps) => {
    return (
        <Stack spacing={4} flex='1'>
            <Text>Insert some text</Text>
            <TextInput name='text2' placeholder='Insert text 1' />
            <Box flex='1' />
            <Button onClick={next}>next</Button>
        </Stack>
    )
}

const Step2 = ({ previous, next }: WizardStepProps) => {
    return (
        <Stack spacing={4} flex='1'>
            <Text>Insert some text</Text>
            <TextInput name='text3' placeholder='Insert text 2' />
            <Box flex='1' />
            <Flex mt='auto' justifyContent='space-between'>
                <Button onClick={previous}>previous</Button>
                <Button onClick={next}>next</Button>
            </Flex>
        </Stack>
    )
}

const Step3 = ({ previous, next }: WizardStepProps) => {
    return (
        <Stack d='flex' spacing={4} flex='1'>
            <Text>Ok stop now</Text>
            <TextInput name='text4' placeholder='Insert text 3' />
            <TextInput name='text5' placeholder='Even more stuff' />
            <Box flex='1' />
            <Flex mt='auto' justifyContent='space-between'>
                <Button onClick={previous}>previous</Button>
                <Button onClick={next}>next</Button>
            </Flex>
        </Stack>
    )
}

const Step4 = ({ reset }: WizardStepProps) => {
    return (
        <Stack d='flex' spacing={4} flex='1' justify='center' align='center'>
            <Text fontSize='48px'>Finished 🥳</Text>
            <Button onClick={reset}>reset</Button>
        </Stack>
    )
}

export const TextInput = ({ name, ...rest }: { name } & InputProps) => {
    const { input, meta } = useField(name, { initialValue: rest.defaultValue })
    return <Input {...input} {...rest} isInvalid={meta.error && meta.touched} />
}

export const Wrapper = ({ children }) => {
    return (
        <>
            <Box
                bg='globalBackground'
                maxWidth='100vw'
                height='100vh'
                position='absolute'
                // align='center'
                left='0'
                p={['0', '0', '50px']}
                right='0'
            >
                <Box
                    d='flex'
                    flexDir='column'
                    maxW='1000px'
                    width='100%'
                    position='relative'
                    mx='auto'
                    minH='500px'
                    shadow='0 0 100px rgba(0,0,0,0.1)'
                    p={['20px', '20px', '50px']}
                    // flex='1'
                    borderRadius='20px'
                    bg={{ dark: 'black', light: 'white' }['light']}
                >
                    {children}
                </Box>
            </Box>
        </>
    )
}
```
