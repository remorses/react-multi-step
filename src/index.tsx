import React, { ReactElement, useEffect, useState, Fragment } from 'react'
import { Form } from 'react-final-form'

const QUERY_PAGE_NUMBER = 'stepNumber'

export interface WizardStepProps {
    // children?: any
    // validate?: Function
    hideFromHistory?: boolean
    isLastStep?: boolean
    isFirstStep?: boolean
    previous?: () => null
    next?: () => null
    reset?: () => null
    validate?: (values) => {}
}

export interface WizardProps {
    showValuesAsJson?: boolean
    onSubmit?: Function
    Wrapper?: any
    children?:
        | React.ReactElement<WizardStepProps>[]
        | React.ReactElement<WizardStepProps>
}

function getStoredValues(): any {
    const hash = makeHash()
    if (localStorage.getItem(hash)) {
        try {
            // @ts-ignore
            const v = JSON.parse(localStorage.getItem(hash))
            console.log('loaded values from local storage', v)
            return v
        } catch (e) {
            console.error(
                'could not reload the form values from local storage: ' +
                    localStorage.getItem(hash),
            )
            localStorage.setItem(makeHash(), '{}')
            return {}
        }
    }
    return {}
}

function setValuesInStorage(values) {
    const hash = makeHash()
    console.log('saving values in localStorage', values, 'with hash ', hash)
    localStorage.setItem(hash, JSON.stringify(values))
}

const makeHash = () => {
    const url = new URL(window.location.href)
    const search = url.searchParams
    search.delete(QUERY_PAGE_NUMBER)
    const hash = url.origin + url.pathname + search
    console.log('made hash', hash)
    return hash
}

function setStepInQuery(newStep, replace = false) {
    if (window.history.pushState) {
        const newurl = new URL(window.location.href)
        newurl.searchParams.set(QUERY_PAGE_NUMBER, newStep.toString())
        console.log('setting current step to the query string', newStep)
        const args: [string, string, string] = [
            window.history.state,
            'Step ' + newStep,
            newurl.search,
        ]
        if (replace) {
            window.history.replaceState(...args)
        } else {
            window.history.pushState(...args)
        }
    }
}

function getStepFromQuery() {
    const url = new URL(window.location.href)
    const stepNum = url.searchParams.get(QUERY_PAGE_NUMBER)
    if (stepNum) {
        return Number(stepNum)
    }
    return 0
}

export const Wizard = (props: WizardProps) => {
    const {
        showValuesAsJson,
        children,
        Wrapper = Fragment,
        onSubmit = (x) => alert(JSON.stringify(x, null, 4)),
    } = props
    const [state, setState] = useState({ step: 0, values: {} })
    const childrenCount = React.Children.count(children)
    const steps: ReactElement[] = React.Children.toArray(children) as any

    useEffect(() => {
        // TODO display loading in the mean time
        let values = getStoredValues()
        let step = getStepFromQuery()
        if (!step) {
            setStepInQuery(0, true)
        }
        setState((state) => ({
            ...state,
            values,
            step,
        }))
    }, [])

    const next = (values) => {
        setState((state) => {
            const newStep = Math.min(state.step + 1, childrenCount - 1)
            setValuesInStorage(state.values)
            if (!steps[newStep].props?.hideFromHistory) {
                setStepInQuery(newStep)
            }
            return {
                ...state,
                step: newStep,
                values: {
                    ...state.values,
                    ...values,
                },
            }
        })
    }

    const previous = () => {
        setState((state) => {
            const newStep = Math.max(state.step - 1, 0)
            setStepInQuery(newStep)
            setValuesInStorage(state.values)
            return {
                ...state,
                step: newStep,
            }
        })
    }

    const validate = (values) => {
        console.log('called validate')
        const activeStep = steps[state.step]
        const errors = activeStep.props.validate
            ? activeStep.props.validate(values)
            : {}
        console.log('errors', errors)
        return errors
    }

    const handleSubmit = (values) => {
        console.log('called next')
        const isLastStep = state.step === childrenCount - 1
        if (isLastStep) {
            return onSubmit(values)
        }
        next(values)
    }

    const reset = () => {
        setState((state) => {
            if (!steps[0].props?.hideFromHistory) {
                setStepInQuery(0)
            }
            setValuesInStorage(state.values)
            return { ...state, step: 0 }
        })
    }
    // console.log(state)

    let activeStep = steps[state.step] as ReactElement

    return (
        <Form
            initialValues={state.values}
            validate={validate}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit, submitting, values }) => (
                <form onSubmit={handleSubmit}>
                    <Wrapper>
                        {React.cloneElement(activeStep, {
                            ...activeStep.props,
                            isLastStep: state.step === childrenCount - 1,
                            isFirstStep: state.step === 0,
                            next: handleSubmit,
                            reset,
                            previous,
                        })}
                        {showValuesAsJson && (
                            <pre
                                style={{
                                    minHeight: '60px',
                                    background: '#eee',
                                    margin: '20px 0',
                                    padding: '20px',
                                }}
                            >
                                {JSON.stringify(values, null, 4)}
                            </pre>
                        )}
                    </Wrapper>
                </form>
            )}
        </Form>
    )
}

// Wizard.Step = ({ children }: WizardStepProps) => children
