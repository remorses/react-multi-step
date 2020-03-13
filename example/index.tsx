import React, { useEffect } from 'react'
import { render } from 'react-dom'
import { Wizard, WizardStepProps } from '../src'
import { Field, useField, useForm } from 'react-final-form'
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
    BoxProps,
    Checkbox,
    CheckboxProps,
} from '@chakra-ui/core'

const App = () => {
    return (
        <ThemeProvider>
            <CSSReset />
            <Wizard showValuesAsJson Wrapper={Wrapper}>
                <Step0 />
                <Step1
                    validate={(values) => {
                        const errors = {} as any
                        if (!values.name) {
                            errors.name = 'Field required'
                        }
                        return errors
                    }}
                />
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
            <Text fontSize='48px'>Welcome to multi-step-form</Text>
            <Text fontSize='24px'>A react component baked with ❤️</Text>
            <Box flex='1' />
            <Button onClick={next}>begin</Button>
        </Stack>
    )
}

const Step1 = ({ next, previous }: WizardStepProps) => {
    return (
        <Stack spacing={4} flex='1'>
            <Text>Your name</Text>
            <TextInput name='name' placeholder='Insert text 1' />
            <ErrorMessage name='name' />
            <SingleCheckbox name='iAmDev' placeholder='Insert text 1'>
                i am developer
            </SingleCheckbox>
            <Box flex='1' />
            <Flex mt='auto' justifyContent='space-between'>
                <Button onClick={previous}>previous</Button>
                <Button onClick={next}>next</Button>
            </Flex>
        </Stack>
    )
}

const Step2 = ({ previous, next }: WizardStepProps) => {
    return (
        <Stack spacing={4} flex='1'>
            <Text>Insert other text</Text>
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
    const form = useForm()
    return (
        <Stack d='flex' spacing={4} flex='1' justify='center' align='center'>
            <Text fontSize='48px'>Finished 🥳</Text>
            <Button
                onClick={() => {
                    reset()
                    form.initialize({})
                }}
            >
                reset
            </Button>
        </Stack>
    )
}

export const TextInput = ({ name, ...rest }: { name } & InputProps) => {
    const { input, meta } = useField(name, { initialValue: rest.defaultValue })
    return <Input {...input} {...rest} isInvalid={meta.error && meta.touched} />
}

export const SingleCheckbox = ({
    name,
    children,
}: { name } & CheckboxProps) => {
    const {
        input: { checked, ...input },
        meta: { error, touched, invalid },
    } = useField(name, {
        type: 'checkbox', // important for RFF to manage the checked prop
    })
    return (
        <Checkbox {...input} isInvalid={touched && invalid} my={4}>
            {children}
        </Checkbox>
    )
}

export const ErrorMessage = ({ name, ...rest }: { name } & BoxProps) => {
    const {
        meta: { error, touched },
    } = useField(name, { subscription: { error: true, touched: true } })
    return (
        <Text {...rest} color='#f00'>
            {touched && error}
        </Text>
    )
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

render(<App />, document.getElementById('root'))

// @ts-ignore
if (module.hot) {
    // @ts-ignore
    module.hot.accept()
}
