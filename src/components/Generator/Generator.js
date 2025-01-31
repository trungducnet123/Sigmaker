import React, { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import classNames from 'classnames';
import PhoneNumber from 'awesome-phonenumber';
import { Panel as ColorPicker } from 'rc-color-picker';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClipboard } from '@fortawesome/free-solid-svg-icons';
import InputSection from './InputSection';
import InfoInput from './InfoInput';
import InfoFormGroup from './InfoFormGroup';
import Signature, { signatureHeaderAndDoctype } from './Signature';
import inputDefaults from './inputDefaults';
import dialCodes from './dialCodes';
import './color-picker.scss';
import styles from './Generator.module.scss';

const Generator = () => {
    const [copied, setCopied] = useState(false);
    const [inputs, setInputs] = useState(inputDefaults);

    const ConnectedSignature = <Signature inputs={inputs} />;

    const signatureString =
        signatureHeaderAndDoctype + renderToStaticMarkup(ConnectedSignature);

    const inputReducer = ({ name, type, value, checked: enabled }) => ({
        ...inputs,
        [name]: {
            ...inputs[name],
            ...(type === 'checkbox' ? { enabled } : { value, enabled: true })
        }
    });

    const enableAssociatedInputReducer = (name, type, enabled) => ({
        [name]: {
            ...inputs[name],
            ...(type === 'checkbox' ? { enabled } : {})
        }
    });

    const handleChange = ({ target }) => {
        setInputs(inputReducer(target));
        setCopied(false);
    };

    const phoneNumber = value =>
        new PhoneNumber(value, inputs.dialCode.value).getNumber('national') ||
        value;

    const handleChangePhone = event => {
        const phoneEvent = event;
        phoneEvent.target.value = phoneNumber(phoneEvent.target.value);
        handleChange(phoneEvent);
    };

    const handleChangeImage = ({ target }) => {
        const { type, checked: enabled } = target;
        setInputs({
            ...inputReducer(target),
            ...enableAssociatedInputReducer('imageSize', type, enabled),
            ...enableAssociatedInputReducer('borderRadius', type, enabled)
        });
    };

    const handleChangeColor = ({ color, target }) => {
        if (color)
            handleChange({
                target: {
                    name: 'linkColor',
                    value: color
                }
            });
        else if (target) handleChange({ target });
    };

    const handleCheckbox = ({ target: { name, checked } }) =>
        setInputs({
            ...inputs,
            [name]: { ...inputs[name], value: checked }
        });

    const handleCopied = event => {
        if (event.preventDefault) event.preventDefault();
        setCopied(true);
    };

    return (
        <Container className={classNames('mt-3', 'mb-5')} role="main">
            <Form onSubmit={handleCopied}>
                <Row>
                    <Col lg={6} xl={5}>
                        <h1 id="settingsHeader">Settings</h1>
                        <div
                            className="accordion"
                            aria-labelledby="settingsHeader"
                        >
                            <InputSection title="Personal Info">
                                <Form.Group
                                    as={Form.Row}
                                    controlId="firstName"
                                    className="my-3"
                                >
                                    <Form.Label column sm={3} lg={4}>
                                        <span className="pl-sm-4">Name</span>
                                    </Form.Label>
                                    {['firstName', 'lastName'].map(name => (
                                        <Col
                                            key={name}
                                            className={`p${
                                                name === 'firstName' ? 'r' : 'l'
                                            }-2`}
                                        >
                                            <InfoInput
                                                name={name}
                                                input={inputs[name]}
                                                autoFocus={name === 'firstName'}
                                                required
                                                onChange={handleChange}
                                            />
                                        </Col>
                                    ))}
                                </Form.Group>
                                <InfoFormGroup
                                    name="email"
                                    input={inputs.email}
                                    onChange={handleChange}
                                />
                                <InfoFormGroup
                                    name="phone"
                                    type="tel"
                                    input={inputs.phone}
                                    onChange={handleChangePhone}
                                    prepend={() => (
                                        <InfoInput
                                            as="select"
                                            name="dialCode"
                                            input={inputs.dialCode}
                                            onChange={handleChange}
                                            disabled={!inputs.phone.enabled}
                                            aria-label="Dial code"
                                            className={classNames(
                                                styles.dialCode,
                                                'custom-select',
                                                'flex-grow-0'
                                            )}
                                        >
                                            {dialCodes.map(({ code }) => (
                                                <option key={code}>
                                                    {code}
                                                </option>
                                            ))}
                                        </InfoInput>
                                    )}
                                />
                            </InputSection>
                            <InputSection title="Personal Links" collapse>
                                <InfoFormGroup
                                    name="site"
                                    type="url"
                                    input={inputs.site}
                                    onChange={handleChange}
                                />
                            </InputSection>
                            <InputSection title="Image">
                                <InfoFormGroup
                                    name="image"
                                    input={inputs.image}
                                    onChange={handleChangeImage}
                                />
                                <InfoFormGroup
                                    name="imageSize"
                                    type="number"
                                    input={inputs.imageSize}
                                    onChange={handleChange}
                                    required={inputs.imageSize.enabled}
                                    disabled={!inputs.imageSize.enabled}
                                    appendText="px"
                                />
                                <InfoFormGroup
                                    name="borderRadius"
                                    type="number"
                                    input={inputs.borderRadius}
                                    onChange={handleChange}
                                    required={inputs.borderRadius.enabled}
                                    disabled={!inputs.borderRadius.enabled}
                                    appendText="px"
                                />
                            </InputSection>
                            <InputSection title="Company">
                                {['role', 'company'].map(name => (
                                    <InfoFormGroup
                                        key={name}
                                        name={name}
                                        input={inputs[name]}
                                        onChange={handleChange}
                                    />
                                ))}
                                <InfoFormGroup
                                    name="companySite"
                                    type="url"
                                    input={inputs.companySite}
                                    onChange={handleChange}
                                    required={inputs.company.enabled}
                                    disabled={!inputs.company.enabled}
                                />
                            </InputSection>
                            <InputSection title="Customize" collapse>
                                <InfoFormGroup
                                    name="salutation"
                                    as="select"
                                    type="select"
                                    input={inputs.salutation}
                                    onChange={handleChange}
                                    required
                                >
                                    {inputs.salutation.options.map(option => (
                                        <option key={option}>{option}</option>
                                    ))}
                                </InfoFormGroup>
                                <Form.Group>
                                    <Form.Check
                                        custom
                                        checked={inputs.showLine.value}
                                        type="checkbox"
                                        name="showLine"
                                        id="showLine-checkbox"
                                        aria-label="Enable line"
                                        label="Show line"
                                        onChange={handleCheckbox}
                                    />
                                </Form.Group>
                                <InfoFormGroup
                                    name="linkColor"
                                    input={inputs.linkColor}
                                    color={
                                        inputs.linkColor.value ||
                                        inputs.linkColor.placeholder
                                    }
                                    onChange={handleChangeColor}
                                    customInput={props => (
                                        <ColorPicker
                                            enableAlpha={false}
                                            {...props}
                                        />
                                    )}
                                />
                            </InputSection>
                        </div>
                    </Col>
                    <Col
                        lg={6}
                        xl={7}
                        className={classNames('mt-4', 'mt-lg-0')}
                    >
                        <h1 id="previewHeader">Preview</h1>
                        <Card
                            body
                            className={classNames(styles.preview, 'mb-4')}
                            aria-live="polite"
                            aria-labelledby="previewHeader"
                        >
                            {ConnectedSignature}
                        </Card>
                        <div
                            className={classNames(
                                'mb-2',
                                'd-flex',
                                'align-items-center',
                                'justify-content-between'
                            )}
                        >
                            <h1 className="mb-0" id="htmlSignatureHeader">
                                HTML Signature
                            </h1>
                            <CopyToClipboard
                                text={signatureString}
                                onCopy={handleCopied}
                            >
                                <Button
                                    type="submit"
                                    variant={copied ? 'success' : 'primary'}
                                >
                                    <FontAwesomeIcon
                                        icon={copied ? faCheck : faClipboard}
                                        fixedWidth
                                        className="mr-2"
                                    />
                                    {copied ? 'Copied' : 'Copy'}
                                </Button>
                            </CopyToClipboard>
                        </div>
                        <Card
                            as="pre"
                            body
                            bg="light"
                            className={classNames(
                                styles.code,
                                'mb-0',
                                'pre-scrollable'
                            )}
                            aria-live="polite"
                            aria-labelledby="htmlSignatureHeader"
                        >
                            {signatureString}
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default Generator;
