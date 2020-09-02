import React from "react";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { AuthUserContext } from "../Session";
import { ClowdrState } from "../../ClowdrTypes";
import AttachmentType from "../../classes/ParseObjects/AttachmentType";
import ProgramItem from "../../classes/ParseObjects/ProgramItem";
import ProgramItemAttachment from "../../classes/ParseObjects/ProgramItemAttachment";
import Parse from "parse";

interface NewMediaLinkFormProps {
    appState: ClowdrState;
    ProgramItem: ProgramItem;
}
interface PublicNewMediaLinkFormProps {
    ProgramItem: ProgramItem;
}

interface NewMediaLinkFormState {
    confirmLoading: boolean,
    visible: boolean,
    AttachmentTypes: AttachmentType[],
    existingAttachments: ProgramItemAttachment[],
    attachmentType?: AttachmentType,
    loading: boolean,
    selectedFile?: File
}

class NewMediaLinkForm extends React.Component<NewMediaLinkFormProps, NewMediaLinkFormState> {
    private form: React.RefObject<any>;
    private fileUpload: React.RefObject<any>;


    constructor(props: NewMediaLinkFormProps) {
        super(props);
        this.form = React.createRef();
        this.fileUpload = React.createRef();
        this.state = {
            visible: false,
            confirmLoading: false,
            AttachmentTypes: [],
            existingAttachments: [],
            loading: true
        };
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        if (this.form && this.form.current) {
            this.form.current.resetFields();
        }
        this.setState({
            visible: false,
            confirmLoading: false
        });

    };

    componentDidMount() {
        let typesPromise: Promise<AttachmentType[]> = this.props.appState.programCache.getAttachmentTypes(this);
        let attachmentsPromise: Promise<ProgramItemAttachment[]>;
        if (this.props.ProgramItem && this.props.ProgramItem.attachments) {
            attachmentsPromise = Parse.Object.fetchAllIfNeeded<ProgramItemAttachment>(this.props.ProgramItem.attachments);
        }
        else {
            attachmentsPromise = new Promise(resolve => resolve([]));
        }

        Promise.all([typesPromise, attachmentsPromise]).then((results) => {
            let types = results[0];
            let attachments = results[1];
            types = types.filter((v) => !attachments.find(y => y.attachmentType.id === v.id));
            this.setState({ AttachmentTypes: types, existingAttachments: attachments, loading: false });
        })
    }

    render() {
        const { visible, confirmLoading } = this.state;
        let buttonText = "New Attachment/Media Link";

        let selectOptions = this.state.AttachmentTypes.map((a) => ({
            label: a.name,
            value: a.id, object: a
        }))
        return <div>
            <Button type="default" onClick={this.showModal}>
                {buttonText}
            </Button>
            <Modal
                zIndex={200}
                title="New Media Link"
                visible={visible}
                confirmLoading={confirmLoading}
                footer={[
                    <Button form="newMediaLinkForm" key="submit" type="primary" htmlType="submit" loading={confirmLoading}>
                        Create
                        </Button>
                ]}
                onCancel={this.handleCancel}
            >
                <Form
                    layout="vertical"
                    name="form_in_modal"
                    ref={this.form}

                    id="newMediaLinkForm"
                    initialValues={{
                    }}
                    onFinish={async (values) => {
                        try {
                            this.setState({ confirmLoading: true })
                            let attachment = new ProgramItemAttachment();
                            attachment.set("programItem", this.props.ProgramItem);
                            attachment.set("url", values['url']);
                            attachment.set("attachmentType", this.state.attachmentType);
                            await attachment.save();
                            if (this.state.selectedFile) {
                                //upload file
                                let name = this.state.selectedFile.name;
                                var parseFile = new Parse.File(name, this.state.selectedFile);
                                await parseFile.save();
                                attachment.set("file", parseFile);
                                await attachment.save();
                            }
                            if (!this.props.ProgramItem.attachments) {
                                this.props.ProgramItem.set("attachments", []);
                            }
                            this.props.ProgramItem.attachments.push(attachment);
                            await this.props.ProgramItem.save();
                            message.success("Successfully created attachment");
                            this.form.current.resetFields();
                            this.setState({ confirmLoading: false, visible: false })
                        } catch (err) {
                            message.error("Error: " + err);
                            this.setState({ confirmLoading: false })
                        }
                    }}
                >
                    <Form.Item
                        name="attachmentType"
                        label="Media Link/Attachment Category"
                        extra="Select the type of link/attachment to create"
                        rules={[{ required: true, message: 'Please select the kind of link/attachment to add' }]}
                    >
                        <Select options={selectOptions} onChange={(value, optionObj) => {
                            // @ts-ignore
                            let attachmentType = optionObj.object;

                            if (!attachmentType.supportsFile) {
                                this.form.current.resetFields(['file'])
                                this.setState({ selectedFile: undefined });
                            }
                            this.setState({ attachmentType: attachmentType })
                        }} />
                    </Form.Item>
                    <Form.Item
                        name="url"
                        label="Link to attachment"
                        dependencies={['file']}
                        // extra=""
                        rules={[
                            {
                                type: 'url',
                                message: 'Please input a valid URL that links to your attachment.',
                            },
                            {
                                validator: async (rule, value) => {
                                    let message = "Please input the link to your attachment"
                                    if (this.state.attachmentType && this.state.attachmentType.supportsFile) {
                                        message = "Please input either an external link OR upload a file";
                                    }
                                    let otherValue = this.form.current.getFieldValue("file");
                                    if (otherValue && value)
                                        throw message;
                                    if (!otherValue && !value)
                                        throw message;
                                    return;
                                }
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="file"
                        dependencies={['url']}
                        label="Upload file"
                        rules={[{
                            validator: async (rule, value) => {
                                if (this.state.attachmentType && this.state.attachmentType.supportsFile) {
                                    let otherValue = this.form.current.getFieldValue("url");
                                    if (otherValue && value)
                                        throw new Error("Please input either an external link OR upload a file");
                                    if (!otherValue && !value)
                                        throw new Error("Please input either an external link OR upload a file");
                                }
                                return;
                            }
                        }]}
                        extra={!this.state.attachmentType ? "Please select an attachment type" : !this.state.attachmentType.supportsFile ? "We do not currently accept uploads for this kind of attachment, please attach a link instead." : ""}
                    >
                        <Input
                            onChange={event => {
                                if (event.target && event.target.files && event.target.files.length === 1)
                                    this.setState({ selectedFile: event.target.files[0] });
                                else
                                    this.setState({ selectedFile: undefined });
                            }}
                            type="file" ref={this.fileUpload} disabled={!this.state.attachmentType || !this.state.attachmentType.supportsFile} />

                    </Form.Item>
                </Form>
            </Modal>
        </div>
        // );
    }
}
const AuthConsumer = (props: PublicNewMediaLinkFormProps) => (
    <AuthUserContext.Consumer>
        {value => (value == null ? <span>TODO: NewMediaLinkForm when clowdrState is null.</span> :
            <NewMediaLinkForm {...props} appState={value} />
        )}
    </AuthUserContext.Consumer>

);
export default AuthConsumer;
