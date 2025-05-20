---
title: "Research Timeline"
permalink: /research-timeline/
author_profile: true
---

<style>
/* Only reset spacing for timeline-specific elements */
.page__content section {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* The vertical line */
.timeline {
  position: relative;
  width: 100%;
  padding: 0;
  margin: 0;
}

.timeline::after {
  content: '';
  position: absolute;
  width: 6px;
  background-color: #3498db;
  top: 0;
  bottom: 0;
  left: 60px;
  margin-left: -3px;
  z-index: 0;
}

/* Container for each timeline item */
.container {
  position: relative;
  background-color: inherit;
  width: calc(100% - 100px);
  margin-left: 100px;
  margin-bottom: 25px;
  padding: 0;
}

/* The circles on the timeline - PERFECTLY CENTERED */
.container::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  left: -49px; /* Adjusted for perfect centering */
  background-color: white;
  border: 3px solid #3498db;
  top: 22px;
  border-radius: 50%;
  z-index: 1;
}

/* Content styling */
.content {
  padding: 25px 30px;
  background-color: #f2f2f2;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.content:hover {
  box-shadow: 0 5px 12px rgba(0,0,0,0.15);
  transform: translateX(5px);
}

/* Arrow pointing to the timeline */
.content::before {
  content: " ";
  height: 0;
  position: absolute;
  top: 22px;
  width: 0;
  z-index: 1;
  left: -10px;
  border: medium solid #f2f2f2;
  border-width: 10px 10px 10px 0;
  border-color: transparent #f2f2f2 transparent transparent;
}

/* Content styling */
.content h2 {
  margin-top: 0;
  color: #3498db;
  font-size: 1.5em;
  margin-bottom: 10px;
}

.date {
  color: #6c757d;
  font-style: italic;
  margin-bottom: 20px;
  display: block;
}

.content p {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1em;
  line-height: 1.6;
}

.content ul {
  margin-top: 0;
  margin-bottom: 15px;
  padding-left: 25px;
  font-size: 1em;
  line-height: 1.6;
}

.content li {
  margin-bottom: 8px;
}

/* Alternating colors */
.container:nth-child(odd) .content {
  background-color: #f9f9f9;
}

.container:nth-child(odd) .content::before {
  border-color: transparent #f9f9f9 transparent transparent;
}

/* Responsive layout - only for the timeline elements */
@media screen and (max-width: 768px) {
  .timeline::after {
    left: 30px;
  }
  
  .container {
    margin-left: 70px;
    width: calc(100% - 85px);
  }
  
  .container::before {
    left: -37px; /* Adjusted for mobile perfect centering */
  }
}

@media screen and (max-width: 480px) {
  .content {
    padding: 20px 25px;
  }
  
  .container {
    margin-left: 60px;
    width: calc(100% - 75px);
  }
  
  .container::before {
    left: -27px; /* Adjusted for smallest screens */
  }
}
</style>

<div class="timeline-container">
  <div class="timeline">

    <div class="container">
      <div class="content">
        <h2>Fall 2023 - Spring 2024</h2>
        <span class="date">Parametric Quantum Circuit (PQC) optimization, QuaLITi</span>
        <p>Wrote two works, one on PQC 1Q gate optimization and one on selecting best hardware for QNN inferencing</p>
        <p>Salient works:</p>
        <ul>
          <li>"Non-parametric Greedy Optimization of Parametric Quantum Circuits"</li>
          <li>"QuaLITi: Quantum Machine Learning Hardware Selection for Inferencing with Top-Tier Performance"</li>
        </ul>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>PhD Comprehensive Exam</h2>
        <span class="date">Spring 2023</span>
        <p>Gave my PhD Comprehensive examination presentation in front of committee members Dr. Swaroop Ghosh, Dr. Mahmut Kandemir, Dr. Abhronil Sengupta, Dr. Sahin Ozdemir and passed.</p>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>Quantum Memories, Shot Optimization</h2>
        <span class="date">Fall 2021 - Spring 2023</span>
        <p>Worked on quantum memories works such as QROM and QRAM. Also worked on optimizing shots in QML algorithms</p>
        <p>Salient works:</p>
        <ul>
          <li>"Optimization of Quantum Read-Only Memory Circuits"</li>
          <li>"Trainable PQC-Based QRAM for Quantum Storage"</li>
          <li>"Shot Optimization in Quantum Machine Learning Architectures to Accelerate Training"</li>
          <li>"Quantum Random Access Memory for Dummies"</li>
        </ul>
      </div>
    </div>

    <div class="container">
      <div class="content">
        <h2>PhD Qualifying Exam</h2>
        <span class="date">Spring 2021</span>
        <p>Passed PhD Qualifying Examination</p>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>First paper: Quantum PUF</h2>
        <span class="date">Fall 2020 - Spring 2021</span>
        <p>Wrote my first PhD paper on fingerprinting quantum hardware titled "Quantum PUF for Security and Trust in Quantum Computing"</p>
        <p>Accomplishments:</p>
        <ul>
          <li>Ran experiments on real quantum hardware</li>
          <li>Distinguishable results for both strong and weak PUFs</li>
          <li>Superposition and Decoherence-based PUFs</li>
        </ul>
      </div>
    </div>
    
    <div class="container">
      <div class="content">
        <h2>PhD started</h2>
        <span class="date">Fall 2020</span>
        <p>Started research in Quantum Computing</p>
      </div>
    </div>
  </div>
</div>