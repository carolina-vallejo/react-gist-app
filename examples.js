////////////

class Square extends React.Component {

  render() {
    return (
      <button className="square" onClick={ () => this.props.onClick() }>
        {this.props.value}
      </button>
    );
  }
}



// Example usage: 
class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }
  handleClick(i) {
    const squares = this.state.squares.slice();

    console.log(this.state.squares.slice());
    console.log(squares[i]);

    squares[i] = squares[i] === 'X' ? 'O' : 'X';

    //--va actualizando el array
    this.setState({squares: squares});
  }  

  renderSquare(i) {
    return (
	    	<Square 
	    		value={this.state.squares[i]} 
	    		onClick={() => this.handleClick(i)}
	    	/>
    	);
  }

  render() {
    const status = 'Next player: X';

    return (

      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (

      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name} &&& {this.props.pop}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div>
        <ShoppingList name="aa" />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

ReactDOM.render(
  <App />,
  document.getElementById('root2')
);

