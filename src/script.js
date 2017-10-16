const _TOKEN_ = 'd7241decf553a1bf119'+'8c559b9013dde2b829f55';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: '',
            users: [],
            count: undefined,
            errorText: '',
            infoText: ''
        };
    }

    onChangeHandle(event) {
        this.setState({searchText: event.target.value});
    }

    onSubmit(event) {
        
        event.preventDefault();
        const {searchText} = this.state;
        if(searchText !== '') {
            const url = `https://api.github.com/search/users?q=${searchText}`;
            fetch(url)
                .then(response => response.json())
                .then(responseJson => this.setState({users: responseJson.items, count: responseJson.total_count}))
                .then((count) => this.matchesCount(this.state.count));
        } else {
            this.setState({
                errorText: "Can't search empty string. Please enter not-empty string",
                infoText: ''
            });
        }
    }

    matchesCount = (args) => {
        // let len = this.state.count;
        let len = args;
        if (len !== undefined) { 
            let additionaInfo = len > 30 ? 'We show you max 30 results.' : '';        
            this.setState({
                infoText: `Found ${len} results. ${additionaInfo}`,
                errorText: ''
            });
        } else {
            this.setState({
                infoText: '',
                errorText: 'Something gonna wrong'
            });
        }
    }    

    render() {
        return (
            <div>
                <div className={'column is-4 is-offset-4'}>
                    <form  onSubmit={event => this.onSubmit(event)}>
                        <div className={'field '}>
                            <label className={'label'} htmlFor="searchText">Search GitHub users by user name</label>
                            <div className={'control has-icons-right'}>
                                <input className={'input'} 
                                    type='text'
                                    id='searchText'
                                    onChange = {event => this.onChangeHandle(event)}
                                    value={this.state.searchText}/>
                                <span className={'icon is-small is-right'}>
                                    <i className={'fa fa-search'}></i>
                                </span>
                                <p className={'help has-text-white'}>
                                    {this.state.infoText} 
                                </p>
                                <p className={'error help has-text-danger has-text-weight-semibold'}>
                                    {this.state.errorText}
                                </p>
                            </div>
                        </div>
                    </form>
                </div> 
                   
                <UsersList users={this.state.users} />
            </div>
        );
    }
}

class UsersList extends React.Component {
    get users() {
            return this.props.users.map( user => <User key={user.id} user={user}/>);
    }

    render() {
        return ( 
            <div className={'columns is-centered'}>
                <div className={'column  is-narrow'}>
                    {this.users}
                </div>
            </div>
        ); 
    }
}

class User extends React.Component {
    constructor() {
        super();
        this.state = {
            details: []
        }
    }

    componentWillMount() {
        const fetchObject = {
            headers: {
                Authorization: `token ${_TOKEN_}`
            }
        };
        fetch(this.props.user.url, fetchObject)
            .then(response => response.json())
            .then(responseJson => this.setState({details: responseJson}));
    }

    render() {
        return (
            <div className={'box'}>
                <article className={'media'}>
                    <div className={'media-left'}>
                        <figure className={'image is-96x96'}>
                            <img src={this.props.user.avatar_url} />
                        </figure>
                        <p className={'is-size-7 has-text-centered'}>
                            Followers: <strong>{this.state.details.followers}</strong>
                        </p>
                    </div>
                    <div className={'media-content'}>
                        <div className={'content'}>
                            <div className={'columns is-mobile'}>
                                <div className="column is-4 has-text-right has-text-weight-light">
                                    Login:
                                </div>
                                <div className="column">
                                    <a href={this.props.user.html_url} target='_blank'>{this.props.user.login}</a>
                                </div>
                            </div>
                            <div className={'columns is-mobile '}>    
                                <div className="column  is-4 has-text-right has-text-weight-light">
                                    Name:
                                </div>
                                <div className="column  has-text-weight-bold">
                                    {this.state.details.name}
                                </div>
                            </div>
                            <div className={'columns is-mobile '}>    
                                <div className="column is-4 has-text-right has-text-weight-light">
                                    Location:
                                </div>
                                <div className="column is-narrow">
                                    {this.state.details.location}
                                </div>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);