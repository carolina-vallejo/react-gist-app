
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
      inputCliked : false,
      actualIndexBox: 0,
      actualTitleBox: ''
    };
  }

  loadData(query) {
    fetch(`https://api.github.com/users/radiodraws/gists`)
    //fetch('data/gists.json')
      .then(response => response.json())
      .then(data => {



        console.log(data);
        this.setState({data: data });
        console.log();

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
  componentDidUpdate(){
    if(typeof this.codeTag !== 'undefined'){
     Prism.highlightElement(this.codeTag, Prism.languages.javascript);
    }


    
  }

  handleClick(i, event) {

    
    var actItem;
    for(let item in this.state.data[i].files){
      this.loadRaw(this.state.data[i].files[item].raw_url, i);
      actItem = item;
    }
    
    this.setState({
      actualTitleBox: actItem,
      inputCliked: true,
      actualIndexBox: i,
    });
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
          <pre>
            <code key={'input'+i} ref={(code) => { this.codeTag = code; }} id="rawcode" className="language-javascript">
            {this.state.file[i]}
            </code>
          </pre>
      </div>
    );
  }        

  render() {
    var index = this.state.actualIndexBox;
    var title = this.state.actualTitleBox;

    //---OJO VER CUANDO SE RENDERIZA Y PORQUE?
    console.log('render!!');

    return (
        <div className="wrapper">
          <div className='view'>
            {
              this.state.inputCliked?
    
              <div className="inner">
                <div className="info">
                  <div className="title">{title}</div>
                  <div>{this.state.data[index].description}</div>
                </div>
                {this.renderPre(index)}
             </div>

              :
    
              <div className="inner">EMPTY</div>
            }
    
          </div>
          <div className='grid'>
            { this.state.data.map((item, i) => {
              return <div key={item.id} className={`item ${i === index ? 'item_active' : 'item_inactive'}`}>
                <div className="item__inner">
                  <div>{item.description}</div>
                  {this.renderButton(i)}
               </div>
              </div>
              })
            }
          </div>
        </div>
    );
  }

}


      
ReactDOM.render(<Gistbox elquery="go"/>, document.getElementById('app'));

/*

UX todo:
- marcar el snipet actual
- mostrar el ultimo by default
- BTN VIEW RAW para copiar!

CODE:

- mejorar los componentes, individualizarlos
- limpiar y unificar codigo

*/




