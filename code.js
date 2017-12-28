
class Button extends React.Component {

  render() {
    return (
      <button className="button" onClick={ () => this.props.onClick() }>
        {this.props.value}
      </button>
    );
  }
}

class Gistbox extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      data: [],
      file: Array(30).fill(''), 
      query : 'd3',
      value : 'java',
      queries: Array(30).fill(''),
      raw: Array(30).fill(''),
      opencode: '',
      inputCliked : false,
      actualIndexBox: 0
    };
  }

  loadData(query) {
    fetch(`https://api.github.com/users/radiodraws/gists`)
    //fetch('data/gists.json')
      .then(response => response.json())
      .then(data => {

        console.log(data);
        this.setState({data: data });
    })
      .catch(err => console.error(this.url, err.toString()))
  }

  loadRaw(query, i) {

    const file = this.state.file.slice();
    fetch(`${query}`)
      .then(response => response.text())
      .then(rawfile => {

        file[i] = rawfile;
        this.setState({file: file });
    })
      .catch(err => console.error(this.url, err.toString()))
  }  
 
  componentDidMount() {
    this.loadData(this.state.query);
  }

  handleClick(i, event) {

    this.setState({opencode:'open'});

    for(let item in this.state.data[i].files){
      this.loadRaw(this.state.data[i].files[item].raw_url, i);
    }

    this.setState({inputCliked: true });
    this.setState({actualIndexBox: i});

  } 

  handleChange(i, event) {
    const queries = this.state.queries.slice();

    queries[i] = event.target.value;

    //console.log(event.target.value);
    this.setState({queries: queries });

  }

  renderInput(i) {
    return (
      <input 
        type="text" 
        value={this.state.queries[i]} 
        onChange={this.handleChange.bind(this, i)} 
      />  
    );
  } 
  renderButton(i) {
    return (
        <Button 
          value={"more"} 
          onClick={this.handleClick.bind(this, i)}
        />
    );
  } 

  renderPre(i) {
    return (
      <div className="code">
        <pre>{this.state.file[i]}</pre>
      </div>
    );
  }        

  render() {
    var index = this.state.actualIndexBox;
    return (
        <div>
          <div className='view'>
            {
              this.state.inputCliked?
    
              <div className='inner'>
                <div>{this.state.data[index].description}</div>
                <div>{this.state.data[index].description}</div>
                {this.renderPre(index)}
             </div>

              :
    
              <div>EMPTY</div>
            }
    
          </div>
          <ul className='grid'>
            { this.state.data.map((item, i) => {
              return <li key={item.id} className='item'>
                <div className='inner'>
                  <div>{item.description}</div>
                  {this.renderInput(i)}
                  {this.renderButton(i)}
               </div>
              </li>
              })
            }
          </ul>
        </div>
    );
  }

}


      
ReactDOM.render(<Gistbox elquery="go"/>, document.getElementById('app'));






