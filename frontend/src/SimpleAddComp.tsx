import * as React from 'react';
import $ from 'jquery';

export interface IProps {
    callback: (data: any) => void;
}

export interface IState {
    content: string;
}

export default class SimpleAddComp extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            content: ""
        }
    }

    onInputUpdate = (event: any) => {
        this.setState({content: event.target.value});
    }

    onButtonClick = (event: any) => {
        $.ajax({
            url: '/ingredient/' + this.state.content,
            type: 'PUT',
            success: (result) => {
                this.props.callback(result);
            },
            error:(err) => {
                // TODO add proper error handling
                console.log(err); // And maybe a logging framework
            },
        });
    }

    render() {
      return (
        <div>
            <input type='text' onChange={this.onInputUpdate} />
            <button onClick={this.onButtonClick}>Add</button>
        </div>
      );
    }
  }