export default class SetupPageStart {
  async render() {
    return `
      <!-- HTML kamu tetap sama -->
      <section class="setup-wrapper">
    <div class="setup-card">
      <div class="setup-content">
        <div class="icon" id="step-icon">
          <img src="logo/setap.gif" alt="Animated Logo" style="width: 80%; height: 80%;" />
        </div>
        <h2 class="title" id="step-title">
          Let’s <span class="green">get</span> your <br /><strong>set up first!</strong>
        </h2>
        <p class="desc" id="step-desc">
          Just a few steps to create your AgriEdu account and start exploring smarter farming tools and learning resources.
        </p>
          <div id="form-step" style="display: none;">
            <form id="setup-form">
              <input type="text" id="name" placeholder="What is Your Name?" required /><br />
              <select id="interest" required>
                <option value="" disabled selected hidden>What are you interested in?</option>
                <option value="urban-farming">Urban Farming</option>
                <option value="tanaman-hias">Tanaman Hias</option>
                <option value="sayuran">Sayuran</option>
                <option value="buah-buahan">Buah-buahan</option>
              </select><br />

              <label>Select your farming experience level:</label>
            <div class="experience-options">
              <label><input type="radio" name="experience" value="Beginner" required /> Beginner</label>
              <label><input type="radio" name="experience" value="Intermediate" /> Intermediate</label>
              <label><input type="radio" name="experience" value="Experienced" /> Experienced</label>
            </div>


              <label>Click on the map to choose your location:</label>
              <div id="map" style="height: 200px;"></div><br />
              <div id="popup" class="ol-popup" style="position: absolute; background: white; padding: 5px; border: 1px solid #ccc; border-radius: 4px;"></div>
              <input type="hidden" id="lat" />
              <input type="hidden" id="lon" />

              <button type="submit">Submit</button>
            </form>
          </div>

          <div class="dots">
            <span class="dot active"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <button id="next-btn">next</button>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const module = await import("./SetupPage-Presenter.js");
    const presenter = new module.default();
    presenter.init();
  }
}
