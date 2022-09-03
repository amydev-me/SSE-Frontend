import React from 'react';
import ReactDOM from 'react-dom';
/**
 * Styles
 */
 

/**
 * API
 */
const API_URL = 'https://counters-dot-sse-2021-jk.appspot.com/api/';

/**
 * Components
 */
class Counter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            isLoaded: false,
            value: 0,
            inputValue: ''
        };
        this.inputValueChanged = this.inputValueChanged.bind(this);
        this.updateValue = this.updateValue.bind(this);
        this.addToCounter = this.addToCounter.bind(this);
        this.setCounter = this.setCounter.bind(this);
        this.refreshCounter = this.refreshCounter.bind(this);
        this.deleteCounter = this.deleteCounter.bind(this);
    }
    componentDidMount() {
        this.updateValue();
        // Set up a timer to update the value every second
        this.timerID = setInterval(
            () => this.updateValue(),
            1000
        );
    }
    componentWillUnmount() {
        // Clear the timer when the counter is deleted
        clearInterval(this.timerID);
    }
    inputValueChanged(evt) {
        // Strip all non-numeric characters from the string as these return NaN form the API and set the counter to 0.
        const newValue = evt.target.value.replace(/\D/g,'');
        this.setState({inputValue: newValue});
    }
    updateValue() {
        // get the value from the API
        fetch(API_URL + this.state.name)
        .then(res => res.text())
      .then(
        (res) => {
          this.setState({
            isLoaded: true,
            value: res
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
    addToCounter(evt) {
        const requestOptions = {
            method: 'POST',
            body: this.state.inputValue
        };
        fetch(API_URL + this.state.name, requestOptions)
        .then(res => res.text())
      .then(
        (res) => {
            console.log(res);
          this.setState({
            isLoaded: true,
            value: res
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
    setCounter(evt) {
        const requestOptions = {
            method: 'PUT',
            body: this.state.inputValue
        };
        fetch(API_URL + this.state.name, requestOptions)
        .then(res => res.text())
      .then(
        (res) => {
            console.log(res);
          this.setState({
            isLoaded: true,
            value: res
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
    refreshCounter(evt) {
        this.updateValue();
    }
    deleteCounter(evt) {
        const requestOptions = {
            method: 'DELETE',
        };
        fetch(API_URL + this.state.name, requestOptions)
      .then(
        (res) => {
            console.log(res);
          this.setState({
            isLoaded: false,
          });
          // Ask the parent component to delete this counter.
          this.props.deleteCounterHandler(this.props.name)
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
    render() {
        const { error, isLoaded} = this.state;
        if (error) {
            console.log(error);
            return (
                <div class="counter">
                        <p class="name">{this.state.name} : ERROR</p>
                </div>
            );
        } else if (!isLoaded) {
            return (
                <div class="counter">
                        <p class="name">{this.state.name} : Loading...</p>
                </div>
            );
        } else {
            return (
                <div class="counter">
                        <p class="name">{this.state.name} : {this.state.value}</p>
                        <input type="number" class="counter_newval" value={this.state.inputValue} onChange={this.inputValueChanged}/>
                        <button class="add" onClick={this.addToCounter}>add</button>
                        <button class="set" onClick={this.setCounter}>set</button>
                        <button class="delete" onClick={this.deleteCounter}>delete</button>
                        <button class="refresh" onClick={this.updateValue}>refresh</button>
                </div>
            );
        }
    }
}

/**
 * Base Application Component
 */
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            counters: [],
            counterNameInput: '',
            errorMessage: ''
        }

        this.deleteCounterHandler = this.deleteCounterHandler.bind(this);
        this.addCounter = this.addCounter.bind(this);
        this.counterNameInputChanged = this.counterNameInputChanged.bind(this);
        this.deleteCounterHandler = this.deleteCounterHandler.bind(this)
    }
    addCounter(evt) {
        if (this.state.counterNameInput != '') {
            const counters = this.state.counters;
            counters.push(this.state.counterNameInput);
            this.setState({
                counters: counters,
            });
        }
    }
    counterNameInputChanged(evt) {
        // Only allow numbers and letters (no spaces)
        const newCounterNameInput = evt.target.value.replace(/[^a-z0-9]/gi,'');
        this.setState({counterNameInput: newCounterNameInput});
    }
    // Passed to counter components so they can request deletion
    deleteCounterHandler(name) {
        const counters = this.state.counters;
        const index = counters.indexOf(name);
        if (index > -1) {
            counters.splice(index, 1);
        }
        this.setState({counters: counters});
        console.log(this.state.counters)
    }
    render() {
        // Render all of the counter components as defined by the state
        const counterElements = [];
        for (const counter in this.state.counters) {
            counterElements.push(<Counter name={this.state.counters[counter]} deleteCounterHandler={this.deleteCounterHandler}/>);
        }
        return (
        <main>
                <header>
                <h1>SSE : API with datastore</h1>
                </header>
                <section id="add-counter">
                    <p>
                        <input  autoFocus id="add-name"
                                title="only accepts digits and letters a-z"
                                pattern="[a-zA-Z0-9_]+"
                                placeholder="Enter name..."
                                value={this.props.counterNameInput}
                                onChange={this.counterNameInputChanged}
                        />
                        <button id="add-counter" onClick={this.addCounter}>Create</button>
                    </p>
                </section>
                <section id="counters">
                    {counterElements}
                </section>
                <footer>
        <p id="error">{this.props.errorMessage}</p>
                </footer>
        </main>
        );
    }
}
  
/**
 * Initial Render
 */
ReactDOM.render(
    <App />,
    document.getElementById('root')
);