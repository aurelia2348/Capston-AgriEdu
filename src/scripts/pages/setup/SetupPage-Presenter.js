export default class SetupPagePresenter {
  constructor() {
    this.currentStep = 0;
    this.titles = [
      `Let’s <span class="green">get</span> your <br /><strong>set up first!</strong>`,
      `Set your <span class="green">preferences</span>`,
      `You’re <span class="green">ready</span> to go!`,
    ];
    this.descriptions = [
      "Just a few steps to create your AgriEdu account and start exploring smarter farming tools and learning resources.",
      "Choose your farming interests and preferred tools so we can personalize your experience.",
      "Your account is all set. Let's grow smarter, together!",
    ];
    this.icons = ["🌱", "⚙️", "✅"];
  }

  init() {
    this.titleEl = document.getElementById("step-title");
    this.descEl = document.getElementById("step-desc");
    this.iconEl = document.getElementById("step-icon");
    this.dots = document.querySelectorAll(".dot");
    this.nextBtn = document.getElementById("next-btn");

    this.nextBtn.addEventListener("click", () => this.nextStep());
  }

  nextStep() {
    if (this.currentStep < this.titles.length - 1) {
      this.currentStep++;
      this.updateStep();
    } else {
      alert("Setup selesai!");
      // window.location.href = '/home';
    }
  }

  updateStep() {
    this.titleEl.innerHTML = this.titles[this.currentStep];
    this.descEl.textContent = this.descriptions[this.currentStep];
    this.iconEl.textContent = this.icons[this.currentStep];

    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentStep);
    });
  }
}
