const _TOKEN_ = 'd7241decf553a1bf119'+'8c559b9013dde2b829f55';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            searchText: '',
            users: [],
            count: 0
        };
    }

    onChangeHandle(event) {
        this.setState({searchText: event.target.value});
    }

    onSubmit(event) {
        event.preventDefault();
        const {searchText} = this.state;
        const url = `https://api.github.com/search/users?q=${searchText}`;
        fetch(url)
            .then(response => response.json())
            .then(responseJson => this.setState({users: responseJson.items, count: responseJson.total_count}));
    }

    matchesCount = () => {
        let len = this.state.count;
        if (len) {
            return this.matches = `Found ${len} results. Max 30 results will be shown.`;
        } else {
            return this.matches = '';
        }
    }    

    render() {
        return (
            <div >
                <div className={'column is-4 is-offset-4'}>
                    <form  onSubmit={event => this.onSubmit(event)}>
                        <div className={'field'}>
                            <label className={'label'} htmlFor="searchText">Search GitHub users by user name</label>
                            <div className={'control has-icons-left'}>
                                <input className={'input'}
                                    type='text'
                                    id='searchText'
                                    onChange = {event => this.onChangeHandle(event)}
                                    value={this.state.searchText}/>
                                <span className={'icon is-small is-left'}>
                                    <i className={'fa fa-user'}></i>
                                </span>
                                <p className={'help has-text-white'}>
                                    {this.matchesCount()} 
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
            <div className={'column is-6 is-offset-3'}>
                {this.users}
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
                        <img src={this.props.user.avatar_url} style={{maxWidth: '100px'}} />
                    </div>
                    <div className={'media-content'}>
                        <div className={'content'}>
                            <p>
                                <strong>Username: </strong> <a href={this.props.user.html_url} target='_blank'>{this.props.user.login}</a>
                            </p>
                            <p>
                                <strong>Name: </strong> {this.state.details.name}
                            </p>    
                            <p>
                                <strong>Location: </strong> {this.state.details.location}
                            </p>    
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