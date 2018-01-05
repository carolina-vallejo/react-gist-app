class Gistbox extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      data: [],
      datalength: 0,
      file: [undefined], 
      query : 'd3',
      value : 'java',
      queries: [Array(30).fill('')],
      inputCliked : false,
      actualIndexBox: 0,
      actualTitleBox: ''
    };
    //this.buttonTag=[];
    //this.handleClick = this.handleClick.bind(this);
  }

  loadData(query) {
    //fetch(`https://api.github.com/users/radiodraws/gists?page=1&per_page=100`)
    fetch('data/gists.json')
      .then(response => response.json())
      .then(data => {

        this.setState({
          datalength : data.length,
          data: data,
          file: Array(data.length).fill([undefined])
        });

        this.handleClick(0);

    })
      .catch(err => console.error(this.url, err.toString()))
  }

  loadRaw(i) {

    //var deep = _.cloneDeep(objects);

      //const cloneFile = Array(this.state.datalength).fill([]);
      const cloneFile = _.cloneDeep(this.state.file);



      var keyName = Object.keys( this.state.data[i].files );
      var arr=[];

      for(let k=0; k<keyName.length; k++){

      fetch(`${this.state.data[i].files[keyName[k]].raw_url}`)
        .then(response => response.text())
        .then(rawfile => {
          
          arr.push(rawfile);

          console.log(cloneFile);
          if(k === keyName.length - 1){
            cloneFile[i] = arr;
            this.setState({
              file: cloneFile,
              actualTitleBox: keyName[0],
              inputCliked: true,
              actualIndexBox: i,

            });            
          }
      })
        .catch(err => console.error(this.url, err.toString()))
        
        //console.log(this.state.data[i].files[keyName[k]].raw_url + ' i ' + i + ' k ' + k);
      }
    


  }  
 
  componentDidMount() {
    this.loadData(this.state.query);
    
  }
  componentDidUpdate(){
    //console.log('UPDATE: this.state.file');
    //console.log(this.state.file);
    //console.log('-------------------->');

    if(typeof this.codeTag !== 'undefined'){
     Prism.highlightElement(this.codeTag, Prism.languages.javascript);
    }
  }

  handleClick(i) {


    if(typeof this.state.file[i][0] === 'undefined'){
      this.loadRaw(i);

    }else{
      this.setState({
        
        inputCliked: true,
        actualIndexBox: i,

      });      
    }
    



  } 

  handleChange(i, event) {
    const queries = this.state.queries.slice();

    queries[i] = event.target.value;
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
        <button 
         // ref={(button) => { this.buttonTag[i] = button; }}
          onClick={this.handleClick.bind(this, i)}>
          {"view"}
        </button>
    );
  } 

  renderPre(i, item) {
    return (
      <div className="code">
          <pre>
            <code key={'input'+i} ref={(code) => { this.codeTag = code; }} id="rawcode" className="language-javascript">
            {
              //console.log(this.state.file)
              item
            }
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
                  <div className="description">{this.state.data[index].description}</div>
                </div>
                {
                  //console.log(this.state.file[index])
                  this.renderPre(index, this.state.file[index])
                  /*
                  this.state.file[index].map((item) => {
                    
                  //  
                  })
                  */

                }
             </div>

              :
  
              <div className="inner">EMPTY</div>
            }
    
          </div>
          <div className='grid'>
            { this.state.data.map((item, i) => {

              return <div key={item.id} className={`item ${i === index ? 'item_active' : 'item_inactive'}`}>
                <div className="item__inner">
                  <div className="title">{Object.keys(item.files)[0]}</div>
                  <div className="description">{item.description}</div>
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
- poner buscador de mis gists
- hacer tags por tipos de archivo x LANGUAGE, 
- cargar todos los files por gist con set Timeout hacer entrgas por tiempo!
- BTN VIEW RAW para copiar!
-btn cargar mas de los 30 primeros
-listando tantos public gists de radiodraws / btn de cambiar user
- idea para animation on click que el azul del btn se agrande en bola hasta cubrir toda el area
-beautify scroll
- rodar prism para cada tipo de archivo

CODE:

- mejorar los componentes, individualizarlos
- limpiar y unificar codigo

*/




