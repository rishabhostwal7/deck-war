import React from "react";

export default function Game() {
  const [gameData, setGameData] = React.useState({
    deckId: null,
    remainingCards: null,
    computerCard: "",
    playerCard: "",
  });
  const [playerScore, setPlayerScore] = React.useState(0);
  const [computerScore, setComputerScore] = React.useState(0);
  const [winnerText, setWinnerText] = React.useState("");

  async function handleClick() {
    const res = await fetch(
      "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
    );
    const data = await res.json();

    setGameData({
      deckId: data.deck_id,
      remainingCards: data.remaining,
      computerCard: "",
      playerCard: "",
    });

    setPlayerScore(0);
    setComputerScore(0);
    setWinnerText("");
  }

  function determineCardWinner(card1, card2) {
    const valueOptions = [
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "JACK",
      "QUEEN",
      "KING",
      "ACE",
    ];
    const card1ValueIndex = valueOptions.indexOf(card1.value);
    const card2ValueIndex = valueOptions.indexOf(card2.value);

    if (card1ValueIndex > card2ValueIndex) {
      setComputerScore((prev) => prev + 1);
      setWinnerText("Computer wins!");
    } else if (card1ValueIndex < card2ValueIndex) {
      setPlayerScore((prev) => prev + 1);
      setWinnerText("You win!");
    } else {
      setWinnerText("War!");
    }
  }

  function drawCard() {
    fetch(
      `https://www.deckofcardsapi.com/api/deck/${gameData.deckId}/draw/?count=2`
    )
      .then((res) => res.json())
      .then((data) => {
        determineCardWinner(data.cards[0], data.cards[1]);

        setGameData((prevState) => ({
          ...prevState,
          remainingCards: data.remaining,
          computerCard: data.cards[0].image,
          playerCard: data.cards[1].image,
        }));

        if (data.remaining === 0) {
          if (computerScore > playerScore) {
            setWinnerText("The computer won the game!");
          } else if (playerScore > computerScore) {
            setWinnerText("You won the game!");
          } else {
            setWinnerText("It's a tie game!");
          }
        }
      });
  }

  return (
    <div className="game--component">
      <div className="top">
        <button id="new-deck" onClick={handleClick}>
          New Deck
        </button>
        <p id="remaining">Remaining cards: {gameData.remainingCards}</p>
      </div>
      <h1 id="header">{winnerText !== "" ? winnerText : "Game of War"}</h1>
      <h3 id="computer-score">Computer score: {computerScore}</h3>
      <div id="cards">
        <div className="card-slot">
          {gameData.computerCard !== "" && (
            <img
              src={gameData.computerCard}
              className="card"
              alt="Computer Card"
            />
          )}
        </div>
        <div className="card-slot">
          {gameData.playerCard !== "" && (
            <img src={gameData.playerCard} className="card" alt="Player Card" />
          )}
        </div>
      </div>
      <h3 id="my-score">My score: {playerScore}</h3>
      <button
        id="draw-cards"
        className="draw"
        onClick={drawCard}
        disabled={gameData.remainingCards === 0 ? true : false}
      >
        Draw
      </button>
    </div>
  );
}
