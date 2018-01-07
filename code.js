var FormattedDate = ReactIntl.FormattedDate;

class Gistbox extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      data: [],
      datalength: 0,
      file: [undefined], 
      activeTab:0,
      query : 'd3',
      value : 'java',
      queries: [Array(30).fill('')],
      inputCliked : false,
      actIndex: 0,
      languages: []
    };
  }

  loadData(query) {
    fetch(`https://api.github.com/users/radiodraws/gists?page=1&per_page=100`)
    //fetch('data/gists.json')
      .then(response => response.json())
      .then(data => {

        var arrLangs = [];

        for(let i = 0; i<data.length; i++){
          var arrFiles = Object.keys(data[i].files);
          data[i].filesarr = arrFiles.map(function(d){
            arrLangs.push(data[i].files[d].language);
           // console.log(data[i].files[d]);
            return data[i].files[d]
          });
        }

        console.log(arrLangs);
        console.log(_.uniqBy(arrLangs));

        this.setState({
          datalength : data.length,
          data: data,
          file: Array(data.length).fill([undefined]),
          languages: _.uniqBy(arrLangs)
        });

        this.handleClick(0);

    })
      .catch(err => console.error(this.url, err.toString()))
  }

  loadRaw(i) {

    console.log('AJAX!!');
    const cloneFile = this.state.file.slice();
    var keyName = Object.keys( this.state.data[i].files );
    var arr=[];
    var fetchCount = 0;

    for(let k=0; k<keyName.length; k++){

      fetch(`${this.state.data[i].files[keyName[k]].raw_url}`)
        .then(response => response.text())
        .then(rawfile => {
          
          arr.push({
            fileName : keyName[k],
            rawfile : rawfile
          });

          fetchCount++;

          if(fetchCount === keyName.length){

            cloneFile[i] = arr;

            this.setState({
              file: cloneFile,
              inputCliked: true,
              actIndex: i,
              activeTab: 0

            });            
          }
      })
        .catch(err => console.error(this.url, err.toString()))
      
    }

  }  
 
  componentDidMount() {
    this.loadData(this.state.query);
    
  }
  componentDidUpdate(){

    if(typeof this.codeTag !== 'undefined'){
     Prism.highlightElement(this.codeTag, Prism.languages.javascript);
    }
  }

  handleClick(i) {

    //---OJO REVISAR ESTO DA ERROR EN FLIP!

    if(typeof this.state.file[i][0] === 'undefined'){
      this.loadRaw(i);
      console.log('is load raw!')

    }else{
      this.setState({
        activeTab: 0,
        inputCliked: true,
        actIndex: i,

      });      

      console.log('is NOT loadraw!')
    }

  } 

  handleChange(i, event) {
    const queries = this.state.queries.slice();

    queries[i] = event.target.value;
    this.setState({queries: queries });

  }

  handleTabClick(i, event) {
    if(i !== this.state.activeTab){
      this.setState({
        activeTab: i
      });      
    }
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
          onClick={this.handleClick.bind(this, i)}>
          {"view"}
        </button>
    );
  } 

  renderPre(item) {
    return (
      <pre>
        <code ref={(code) => { this.codeTag = code; }} className="language-javascript">
        {item}
        </code>
      </pre>
    );
  }        

  render() {
    return (
        <div className="wrapper">
          <div className='view'>
            {
              this.state.inputCliked?
    
              <div className="inner">
                <div className="info">
                  <div className="info__lang">
                  {
                    this.state.data[this.state.actIndex].filesarr.map((item, i)=>{

                      return <span key={'lang-item-' + i}>
                        {
                          item.language + (i===this.state.data[this.state.actIndex].filesarr.length - 1 ? '' : ', ')
                        }
                      </span>
                      
                    })

                  }

                  </div>
                  <div className="info__title">
                  {this.state.data[this.state.actIndex].description}
                  </div>
                  <div className="info__date">
                    {"Created at "}
                    <FormattedDate
                      value={this.state.data[this.state.actIndex].updated_at}
                      day="numeric"
                      month="long"
                      year="numeric" />
                  </div>              
                </div>
                <div className="code">
                  <div className="code__nav">
                    {
                      this.state.file[this.state.actIndex].map((item, i) => {
                        //console.log(item);
                        return <span 
                          onClick={this.handleTabClick.bind(this, i)}
                          className={`code__nav__item ${i === this.state.activeTab ? 'code__nav__item_active' : ''}`}
                          key={'nav-item-' + i}>
                          {item.fileName}
                        </span>
                      })
                    }    
                  </div> 
                  <div className="code__tabs">
                    <div 
                      className="code__tabs__source"> 
                      {
                        this.renderPre(this.state.file[this.state.actIndex][this.state.activeTab].rawfile)
                      }
                    </div>
                  </div>
                </div>
              </div>

              :
  
              <div className="inner">EMPTY</div>
            }
    
          </div>
          <div className='grid'>
            { this.state.data.map((item, i) => {

              return <div key={item.id} className={`item ${i === this.state.actIndex ? 'item_active' : 'item_inactive'}`}>
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




