// Initialize vote counts
let votes = {
  "JavaScript": 0,
  "Python": 0,
  "Java": 0
};

// Function to handle user vote


// Function to update vote display
function vote(language) {
    votes[language]++;
  document.getElementById("jsVotes").innerText = `JavaScript :${votes["JavaScript"]} votes`;
  document.getElementById("pythonVotes").innerText = `Python :${votes["Python"]} votes`;
  document.getElementById("javaVotes").innerText = `Java :${votes["Java"]} votes`;
}
