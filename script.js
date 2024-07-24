document.addEventListener('DOMContentLoaded', () => {
  let currentQuestionIndex = 0;
  let quizData = []; // This will store the quiz questions

  // Function to fetch questions from the Open Trivia Database
  async function fetchQuestions() {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      const data = await response.json();
      quizData = data.results.map(item => ({
        question: item.question,
        choices: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
        answer: item.correct_answer,
        hint: "Think about the correct choice!" // Simplified hint
      }));
      loadQuestion(currentQuestionIndex);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  // Function to load a question based on the current index
  function loadQuestion(questionIndex) {
    const questionContainer = document.getElementById('question');
    const choicesContainer = document.getElementById('choices');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    
    if (questionIndex >= 0 && questionIndex < quizData.length) {
      const currentQuestion = quizData[questionIndex];
      
      // Set question text
      questionContainer.innerHTML = currentQuestion.question;
      choicesContainer.innerHTML = '';

      // Display choices
      currentQuestion.choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice;
        button.classList.add('choice-button');
        button.onclick = () => handleAnswer(choice, currentQuestion.answer, button);
        choicesContainer.appendChild(button);
      });

      // Show/Hide buttons based on the current question index
      prevButton.style.display = questionIndex > 0 ? 'inline-block' : 'none';
      nextButton.style.display = questionIndex < quizData.length - 1 ? 'inline-block' : 'none';
    }
  }

  // Function to handle answer selection
  function handleAnswer(selectedChoice, correctAnswer, selectedButton) {
    const choiceButtons = document.querySelectorAll('.choice-button');

    // Disable all buttons after an answer is selected
    choiceButtons.forEach(button => {
      button.disabled = true;
    });

    // Check if the selected choice is correct
    if (selectedChoice === correctAnswer) {
      selectedButton.style.backgroundColor = '#4caf50'; // Green for correct
      alert('Correct!');
    } else {
      selectedButton.style.backgroundColor = '#9e9e9e'; // Gray for incorrect
      alert('Incorrect! The correct answer was: ' + correctAnswer);
    }

    // Display the next question after a delay
    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizData.length) {
        loadQuestion(currentQuestionIndex);
      } else {
        alert('Quiz completed!');
      }
    }, 1000); // Delay before moving to the next question
  }

  // Event listeners for the navigation buttons
  document.getElementById('next').addEventListener('click', () => {
    if (currentQuestionIndex < quizData.length - 1) {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
    }
  });

  document.getElementById('prev').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestion(currentQuestionIndex);
    }
  });

  // Event listener for the hint button
  document.getElementById('hint').addEventListener('click', () => {
    alert(quizData[currentQuestionIndex].hint);
  });

  // Fetch questions when the page loads
  fetchQuestions();

  // Theme toggle functionality
  document.getElementById('theme-toggle').addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-gray-mode');
      document.getElementById('theme-toggle').innerText = 'Switch to Light Mode';
    } else {
      document.body.classList.remove('dark-gray-mode');
      document.body.classList.add('light-mode');
      document.getElementById('theme-toggle').innerText = 'Switch to Dark Gray Mode';
    }
  });
});
