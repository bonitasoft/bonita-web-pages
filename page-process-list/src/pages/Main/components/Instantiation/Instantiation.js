import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Instantiation.css';

export default class Instantiation extends Component {

    constructor(props) {
        super(props);
        this.onFormSubmited = this.onFormSubmited.bind(this);
        this.messageListener = window.addEventListener('message', this.onFormSubmited, false);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.messageListener);
    }

    onFormSubmited(message) {
        const messageData = message.data;
        var jsonMessage = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
        if (jsonMessage.action === 'Start process' && jsonMessage.message === 'success') {
            this.props.history.push('/');
        }
    };

    render() {
        const {processName, processVersion} = this.props.match.params;

        return (
            <iframe
                className="Instantiation container border"
                src={`../../../../process/${processName}/${processVersion}/content/${this.props.location.search}`}
                title="Instantiation"
            />
        );
    }
}
