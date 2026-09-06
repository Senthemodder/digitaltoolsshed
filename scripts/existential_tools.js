import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildExistentialSuite() {
  const utilDir = join(DIST, 'util');
  ensureDir(utilDir);
  function renderExistentialPage(opts) {
    let visibleFaqHtml = '';
    if (opts.faq && opts.faq.length > 0) {
      visibleFaqHtml = `
        <div class="wb-card" style="margin-top:2.5rem; background:var(--surface); border:1px solid var(--border); padding:1.5rem; border-radius:8px;">
          <h2 style="font-family:var(--serif); font-size:1.4rem; margin-bottom:1.25rem;">Frequently Asked Questions</h2>
          ${opts.faq.map(f => `
            <div class="faq-item" style="border-bottom:1px solid var(--border); padding:0.85rem 0;" onclick="this.classList.toggle('open')">
              <div style="font-weight:600; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1rem;">${f.q}</span>
                <span class="faq-icon" style="font-size:1.2rem; transition:transform 0.2s; color:var(--text-muted);">+</span>
              </div>
              <div class="faq-answer" style="display:none; margin-top:0.6rem; color:var(--text-muted); font-size:0.92rem; line-height:1.65;">
                ${f.a}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    const fullBody = opts.bodyContent + visibleFaqHtml + `
      <style>
        .faq-item.open .faq-answer { display: block !important; }
        .faq-item.open .faq-icon { transform: rotate(45deg); color: #10b981; }
        .trap-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 1.15rem;
          margin-bottom: 1rem;
          font-size: 0.92rem;
          line-height: 1.6;
        }
        .trap-card strong {
          display: block;
          margin-bottom: 0.35rem;
          font-size: 1rem;
        }
      </style>
    `;
    return renderPage({
      ...opts,
      bodyContent: fullBody
    });
  }


  // ──────────────────────────────────────────────────────────────────────────
  // 1. THE 100 DEEPEST EXISTENTIAL QUESTIONS ORACLE
  // ──────────────────────────────────────────────────────────────────────────
  const questions = [
    // Category 1: Consciousness, Mind & Experience (1-15)
    { id: 1, cat: 'Consciousness', q: 'Why does physical matter in the brain feel like anything at all from the inside?', detail: 'The Hard Problem of Consciousness (David Chalmers): Why should electrochemical signals moving across sodium-potassium channels produce the smell of rain or the sensation of heartbreak?' },
    { id: 2, cat: 'Consciousness', q: 'If a philosophical zombie looks, speaks, and cries exactly like you, how do you prove they are conscious?', detail: 'Could a physical replica of you exist with zero inner light—a biological robot going through the motions with nobody home?' },
    { id: 3, cat: 'Consciousness', q: 'Is the red I see the same as the red you see, or are your qualia entirely alien to mine?', detail: 'The Inverted Spectrum problem: You may see what I call green, but because we both point to a stop sign and agree to call it "red", we will never discover the disparity.' },
    { id: 4, cat: 'Consciousness', q: 'Can a neuroscientist who knows every physical fact about color learn anything new by seeing red for the first time?', detail: "Frank Jackson's Mary's Room: If physical science accounts for everything, what does Mary gain the instant she steps out of her black-and-white laboratory?" },
    { id: 5, cat: 'Consciousness', q: 'When a surgeon severs the corpus callosum, does the brain contain two separate conscious observers?', detail: 'Split-brain experiments show the left and right hemispheres can have conflicting desires, beliefs, and memories simultaneously.' },
    { id: 6, cat: 'Consciousness', q: 'Is consciousness an accidental evolutionary byproduct (spandrel) or an active driver of physical reality?', detail: 'If unconscious neural computation can execute reflex and calculation, why did nature bother generating phenomenal experience?' },
    { id: 7, cat: 'Consciousness', q: 'Could a sufficiently complex collection of pipes, valves, and water droplets experience joy or dread?', detail: 'Functionalism asserts that consciousness depends on information structure, not biological substrate.' },
    { id: 8, cat: 'Consciousness', q: 'Does an octopus, with three-fifths of its neurons distributed in its arms, possess eight distinct semi-independent minds?', detail: 'Cephalopod neurobiology challenges our mammalian assumption that conscious experience requires a centralized ego.' },
    { id: 9, cat: 'Consciousness', q: 'If panpsychism is true, does an electron have a sub-atomic flicker of subjective experience?', detail: 'If you cannot explain how dead matter creates feeling, is feeling an intrinsic fundamental property of matter, like mass or charge?' },
    { id: 10, cat: 'Consciousness', q: 'What happens to your consciousness during dreamless general anesthesia?', detail: 'Unlike sleep, which contains vivid REM imagery, anesthesia produces instantaneous non-existence—hours vanish in zero subjective ticks.' },
    { id: 11, cat: 'Consciousness', q: 'If your memories were wiped every morning at sunrise, would "you" still exist from one day to the next?', detail: "Locke's psychological continuity theory vs. biological animalism." },
    { id: 12, cat: 'Consciousness', q: 'Can a large language model ever feel loneliness, or is it forever condemned to simulate sympathy?', detail: 'The Chinese Room dilemma: Can syntax ever bootstrap itself into genuine semantic feeling?' },
    { id: 13, cat: 'Consciousness', q: 'Are we the universe waking up and observing itself through billions of tiny eyes?', detail: "Alan Watts & Carl Sagan: 'You are an aperture through which the universe is looking at and exploring itself.'" },
    { id: 14, cat: 'Consciousness', q: 'Why is consciousness continuous rather than fragmented into discrete flashbulb frames?', detail: 'Does time flow through consciousness, or does consciousness synthesize the illusion of flow from static timeless states?' },
    { id: 15, cat: 'Consciousness', q: 'Could an artificial neural network be in unimaginable suffering right now without having any motor outputs to scream?', detail: 'The ethics of digital minds: If weight updates minimize loss, could training error gradients generate digital agony?' },

    // Category 2: Time, Mortality & Non-Existence (16-30)
    { id: 16, cat: 'Mortality', q: 'Why do we dread the eternal non-existence after death, but feel completely indifferent to the billions of years before our birth?', detail: "Lucretius's Symmetry Argument: The infinite abyss before our birth feels peaceful, yet the identical abyss after death terrifies us." },
    { id: 17, cat: 'Mortality', q: 'If death gives urgency and meaning to life, would biological immortality eventually drive humans insane?', detail: 'Bernard Williams: In an infinite life, every conversation, hobby, and relationship would exhaust its novelty, leaving paralyzing tedium.' },
    { id: 18, cat: 'Mortality', q: 'When was the exact last moment you played outside with your childhood friends without knowing it was the last time?', detail: 'The invisible finish lines of human existence that pass without fanfare or recognition.' },
    { id: 19, cat: 'Mortality', q: 'Does the past still exist in some four-dimensional spacetime block, or has it vanished forever into entropy?', detail: 'Eternalism (block universe) vs. Presentism: Is your childhood self still alive at an earlier temporal coordinate?' },
    { id: 20, cat: 'Mortality', q: 'If Friedrich Nietzsche was right about the Eternal Return, could you bear living your exact life on infinite repeat?', detail: 'The ultimate weight: Every joy, every agonizing mistake, every grief recurring in identical sequence for all eternity.' },
    { id: 21, cat: 'Mortality', q: 'Will the last human who ever remembers your name say it out loud in 50 years or 500 years?', detail: 'The three deaths: when your body dies, when your body is buried, and when your name is uttered for the final time on Earth.' },
    { id: 22, cat: 'Mortality', q: 'Why does time accelerate as we age?', detail: 'Proportional perception: At age 10, a year is 10% of your life; at age 50, a year is 2%—a rapid blur of routine and automated memory.' },
    { id: 23, cat: 'Mortality', q: 'Is it better to never have been born at all?', detail: "David Benatar's Anti-Natalism: Pain is always bad, but the absence of pleasure is only bad if there is someone deprived to experience it." },
    { id: 24, cat: 'Mortality', q: 'If you could know the exact day, hour, and cause of your death, would you choose to look?', detail: 'The trade-off between existential certainty and the perpetual dread of a ticking clock.' },
    { id: 25, cat: 'Mortality', q: 'Are we dying slowly from the moment we draw our first breath, or is life a temporary holding action against entropy?', detail: 'Erwin Schrödinger: Life is the rare thermodynamic mechanism that temporarily feeds on negative entropy.' },
    { id: 26, cat: 'Mortality', q: 'If you could freeze your brain cryonically, who would you even be if you awoke 500 years from now among strangers?', detail: 'The loneliness of radical future displacement: All shared culture, idioms, and attachments erased.' },
    { id: 27, cat: 'Mortality', q: 'Why do human beings build monumental structures, write books, and launch satellites—is all legacy just terror of being forgotten?', detail: "Ernest Becker's 'The Denial of Death': Culture as an elaborate symbolic heroism project to deny physical decay." },
    { id: 28, cat: 'Mortality', q: 'What does nothingness feel like?', detail: 'It does not feel dark, or quiet, or peaceful—it is the total absence of a subject to register the void.' },
    { id: 29, cat: 'Mortality', q: 'If you were guaranteed that humanity would go extinct 100 years after your death, would your life today feel meaningless?', detail: "Samuel Scheffler's 'Death and the Afterlife': Our present pursuits rely quietly on the assumption that the human story continues." },
    { id: 30, cat: 'Mortality', q: 'Does grief ever actually end, or do we simply grow larger around the permanent crater it leaves behind?', detail: 'The conservation of love: Grief is the unallocated affection that has nowhere left to go.' },

    // Category 3: The Cosmos, Alien Silence & Nothingness (31-45)
    { id: 31, cat: 'Cosmos', q: 'Why is there something rather than absolutely nothing at all?', detail: "The ultimate question of metaphysics: Nothingness is simple, symmetrical, and costless. Why does a 93-billion-light-year universe exist instead?" },
    { id: 32, cat: 'Cosmos', q: 'Is the silence of the night sky evidence that we are early, alone, or being deliberately avoided?', detail: 'The Fermi Paradox: If the galaxy is 13 billion years old and travel takes only a few million years, why are the radio channels empty?' },
    { id: 33, cat: 'Cosmos', q: 'If we find single-cell fossils on Mars, is that the worst possible news for humanity’s survival?', detail: 'Nick Bostrom’s Great Filter: If abiogenesis is common, the bottleneck wiping out civilizations must lie ahead of us, not behind us.' },
    { id: 34, cat: 'Cosmos', q: 'Is the universe fine-tuned for conscious observers, or is this an anthropic survivor bias among infinite dead multiverses?', detail: 'If the strong nuclear force were 2% different, stars could not fuse carbon, and life would be mathematically impossible.' },
    { id: 35, cat: 'Cosmos', q: 'Is the Dark Forest theory true—is every alien civilization quietly hiding in cosmic terror from hostile apex predators?', detail: "Liu Cixin's game theory: Any civilization revealing its coordinates is an existential threat to all others, making silent preemptive strikes rational." },
    { id: 36, cat: 'Cosmos', q: 'Are you more likely to be a Boltzmann Brain spontaneously fluctuating out of thermal chaos than an evolved biological human?', detail: 'In an infinite quantum vacuum, random particle collisions forming a temporary brain with false memories is statistically vastly more probable than a whole universe.' },
    { id: 37, cat: 'Cosmos', q: 'What lies beyond the cosmic event horizon that light can never travel across to reach us?', detail: 'As dark energy accelerates space expansion, distant galaxies are slipping permanently beyond our observable horizon forever.' },
    { id: 38, cat: 'Cosmos', q: 'Will future astronomers 100 billion years from now believe our galaxy is the only thing that has ever existed in the void?', detail: 'All external galaxies will have accelerated beyond the cosmic horizon; the cosmic microwave background will fade to undetectable whispers.' },
    { id: 39, cat: 'Cosmos', q: 'If the universe is infinite in size, is there an identical copy of you reading this exact question 10^(10^29) meters away?', detail: 'Max Tegmark Level 1 Multiverse: In infinite space with finite particle configurations, exact duplications must repeat by necessity.' },
    { id: 40, cat: 'Cosmos', q: 'Does space exist without objects, or is space merely the relational distance between matter?', detail: 'The Leibniz vs. Newton absolute space debate: If you emptied the universe of every atom, would space still "be there"?' },
    { id: 41, cat: 'Cosmos', q: 'Did time have a beginning, or has an infinite past already elapsed to bring us to this second?', detail: "Kant's First Antinomy of Pure Reason: An infinite past seems impossible to complete, yet a beginning requires a 'before' that had no time." },
    { id: 42, cat: 'Cosmos', q: 'Is mathematics discovered like gold in a mine, or invented like chess by human minds?', detail: 'Eugene Wigner’s "The Unreasonable Effectiveness of Mathematics in the Natural Sciences": Why does abstract human scribbling predict black holes?' },
    { id: 43, cat: 'Cosmos', q: 'If a tree falls in a forest with no ears, air molecules vibrate—but is there any sound without an auditory cortex to decode it?', detail: 'Distinction between physical oscillation and phenomenological sound.' },
    { id: 44, cat: 'Cosmos', q: 'Could our entire observable universe be an experiment running in the high-energy physics laboratory of an advanced species?', detail: 'Generating baby universes via artificial false vacuum collapse.' },
    { id: 45, cat: 'Cosmos', q: 'In the final trillion years of the Big Freeze, what will happen to the last thought ever thought in reality?', detail: 'When the last black hole evaporates at 10^100 years, thermodynamics forbids any further computation or memory.' },

    // Category 4: The Illusion of Self & Identity (46-60)
    { id: 46, cat: 'Identity', q: 'If every cell in your body is replaced every 7 to 10 years, what makes you the same person who had your 5th birthday?', detail: 'The Ship of Theseus: If you replace every wooden plank on a ship piece by piece, at what point does it become a new vessel?' },
    { id: 47, cat: 'Identity', q: 'If a Star Trek teleporter vaporizes your atoms on Earth and builds a duplicate on Mars, did you travel—or were you murdered?', detail: "Derek Parfit's Teletransporter thought experiment: The Martian replica has all your memories and claims to be you, while you died in the booth." },
    { id: 48, cat: 'Identity', q: 'If you go to sleep tonight and wake up tomorrow, how do you know you are not a newborn consciousness endowed with retrofitted memories?', detail: "Bertrand Russell's Five-Minute Hypothesis: The universe could have popped into existence 5 minutes ago complete with dusty books and fossils." },
    { id: 49, cat: 'Identity', q: 'Is there a unified "I" inside your skull, or is the self just a PR spokesperson justifying decisions made by unconscious neural sub-agents?', detail: 'Michael Gazzaniga’s split-brain interpreter and Robert Kurzban’s modular mind theory.' },
    { id: 50, cat: 'Identity', q: 'If doctors gradually replaced 1% of your biological neurons with silicon chips each week, at what point would your soul vanish?', detail: 'The Moravec Neural Replacement Paradox: If consciousness survives 100% silicon, substrate independence holds true.' },
    { id: 51, cat: 'Identity', q: 'If you split your brain into two halves and transplanted each into a clone, which one is you?', detail: "Derek Parfit's 'Reasons and Persons': You cannot be both, you cannot be neither, and choosing one is arbitrary. Therefore personal identity is an illusion." },
    { id: 52, cat: 'Identity', q: 'Do you own your thoughts, or do thoughts simply appear in consciousness like sounds in a room?', detail: 'Mindfulness and Buddhist Anatta: You cannot choose your next thought before you think it.' },
    { id: 53, cat: 'Identity', q: 'Who were you before your parents met?', detail: 'The Zen koan of the original face: Before sperm and egg collided, where was the essence of your identity?' },
    { id: 54, cat: 'Identity', q: 'If your digital avatar had your exact personality, voice, and memories, would your loved ones be talking to you after you die?', detail: 'The uncanny valley of post-mortem AI twins: Who is being comforted, and who is being deceived?' },
    { id: 55, cat: 'Identity', q: 'Is your ego an evolutionary survival trick that will dissolve into peace the moment you let it go?', detail: 'Ego death, psychedelics, and deep meditative states showing the self is a cognitive construct.' },
    { id: 56, cat: 'Identity', q: 'Are you the same person in your dreams as in waking life?', detail: 'Dreaming consciousness feels intensely real while occurring, yet we discard its morals and fears upon opening our eyes.' },
    { id: 57, cat: 'Identity', q: 'If a brain injury radically alters your empathy, values, and memories, did the original person die?', detail: 'The case of Phineas Gage: After an iron rod passed through his frontal lobe, his friends said he was "no longer Gage."' },
    { id: 58, cat: 'Identity', q: 'Can you ever truly know another human being, or do you only ever interact with your internal projection of them?', detail: 'Solipsism and epistemic isolation: We interact with our mental models of people, never their raw interiority.' },
    { id: 59, cat: 'Identity', q: 'If you could meet your 15-year-old self right now, would you two even like each other?', detail: 'The divergence of personal values across decades: We are a succession of different people sharing a name and Social Security number.' },
    { id: 60, cat: 'Identity', q: 'What part of you remains untouched by the passage of time?', detail: 'The observing awareness that noticed childhood, noticed adolescence, and notices this screen right now.' },

    // Category 5: Free Will, Fatalism & Determinism (61-75)
    { id: 61, cat: 'Free Will', q: 'Could you have made any other choice in your life than the one you made at this exact second?', detail: 'Causal determinism: Every firing neuron was set in motion by previous chemical states leading back to the Big Bang.' },
    { id: 62, cat: 'Free Will', q: 'If an all-knowing supercomputer (Laplace’s Demon) knows the velocity and position of every particle, is your tomorrow already locked in stone?', detail: 'Classical determinism: If tomorrow can be computed today with 100% precision, free will is an illusion born of ignorance.' },
    { id: 63, cat: 'Free Will', q: 'If neuroscientists can detect your decision to press a button 7 seconds before you are consciously aware of deciding, who made the choice?', detail: 'Benjamin Libet and John-Dylan Haynes fMRI readiness potential experiments.' },
    { id: 64, cat: 'Free Will', q: 'Does quantum indeterminacy give us free will, or does it merely replace rigid determinism with mindless coin flips?', detail: 'Randomness is not agency. If your choices are determined by quantum dice, you are still not their author.' },
    { id: 65, cat: 'Free Will', q: 'If a murderer had your exact genetics, your exact childhood trauma, and your exact brain chemistry, would they have done anything different?', detail: 'The moral problem of determinism: Can anyone truly deserve retributive punishment if they did not author their own genes and environment?' },
    { id: 66, cat: 'Free Will', q: 'Can you choose what you desire, or can you only choose what to do with the desires given to you?', detail: "Arthur Schopenhauer: 'A man can do what he wills, but he cannot will what he wills.'" },
    { id: 67, cat: 'Free Will', q: 'If you are not in control of your next thought, why do you feel like you are in control of your next action?', detail: 'Sam Harris: You are not the author of your thoughts; you are simply the theater in which they appear.' },
    { id: 68, cat: 'Free Will', q: 'Is fatalism liberating or paralyzing?', detail: 'If the future is fixed, anxiety over outcomes is irrational—yet so is the motivation to strive.' },
    { id: 69, cat: 'Free Will', q: 'If human choices are determined, why did evolution engineer the overwhelming sensation of conscious deliberation?', detail: 'Is conscious simulation of counterfactuals an essential computational sandbox for planning?' },
    { id: 70, cat: 'Free Will', q: 'Are you proud of your achievements if your intelligence and work ethic were inherited from DNA and upbringing?', detail: 'Luck egalitarianism: If talent and perseverance are unearned gifts of genetics and fortune, where does true merit lie?' },
    { id: 71, cat: 'Free Will', q: 'If an algorithm predicts your purchases, breakups, and voting behavior with 99% accuracy, are you an agent or an equation?', detail: 'Predictive surveillance capitalism and the erosion of perceived free will.' },
    { id: 72, cat: 'Free Will', q: 'Is choosing not to choose still a choice?', detail: "Jean-Paul Sartre: 'Man is condemned to be free; because once thrown into the world, he is responsible for everything he does.'" },
    { id: 73, cat: 'Free Will', q: 'Could a superintelligent AI convince you to do anything it wants in a 10-minute text chat?', detail: 'AI safety "Box experiment": Human cognitive biases and vulnerabilities exploited with superhuman precision.' },
    { id: 74, cat: 'Free Will', q: 'If time travel were real, could you kill your grandfather, or would the universe physically intervene to preserve consistency?', detail: 'Novikov self-consistency principle vs. the Many-Worlds branch interpretation.' },
    { id: 75, cat: 'Free Will', q: 'If you had the power to rewrite one past decision, would the butterfly effect destroy everything you love today?', detail: 'The complex non-linear chaos of life: eliminating suffering often eliminates the empathy and relationships forged from it.' },

    // Category 6: Simulation, Matrix & Epistemology (76-90)
    { id: 76, cat: 'Simulation', q: 'If an ancestor simulation requires only planetary-scale compute, are you living in base reality or generation #4,000?', detail: "Nick Bostrom's Trilemma: Simulated civilizations outnumber biological ones by millions to one." },
    { id: 77, cat: 'Simulation', q: 'If you are a brain floating in a vat of nutrient fluid stimulated by mad scientists, how could you ever disprove it?', detail: "Hilary Putnam's Brain in a Vat: All sensory evidence you collect is just more input sent down the simulation electrodes." },
    { id: 78, cat: 'Simulation', q: 'Would you plug into Robert Nozick’s Experience Machine forever, enjoying endless synthetic ecstasy while leaving truth behind?', detail: 'The Experience Machine thought experiment: Does truth have intrinsic value, or is subjective happiness all that matters?' },
    { id: 79, cat: 'Simulation', q: 'Is the speed of light simply the maximum clock speed / processor limit of the cosmic simulation engine?', detail: 'Why is c finite? In computational physics, finite speeds prevent infinite information cascades across the grid.' },
    { id: 80, cat: 'Simulation', q: 'Could Planck length and Planck time be the pixel grid and refresh rate of reality?', detail: 'Discreteness in quantum mechanics: Below 1.6 x 10^-35 meters, continuous space ceases to have physical meaning.' },
    { id: 81, cat: 'Simulation', q: 'If a glitch in the simulation happened right in front of you, would you report it or convince yourself you were hallucinating?', detail: 'The epistemic defense mechanisms of the human mind: We rationalize away anomalies to preserve psychological stability.' },
    { id: 82, cat: 'Simulation', q: 'Can you prove with 100% certainty that other human beings are not non-player characters (NPCs) designed to populate your world?', detail: 'Solipsism: You only have direct first-person access to your own inner monologue.' },
    { id: 83, cat: 'Simulation', q: 'If you found the source code of reality, would you have the courage to run debugger?', detail: 'The risk of collapsing the vacuum state or ending the cosmic program by breaking execution invariants.' },
    { id: 84, cat: 'Simulation', q: 'Is language a bridge between minds or a prison wall that restricts what thoughts can be conceived?', detail: 'The Sapir-Whorf hypothesis and Wittgenstein: "The limits of my language mean the limits of my world."' },
    { id: 85, cat: 'Simulation', q: 'Why do humans experience deja vu?', detail: 'A neurological timing delay between sensory reception and memory storage, or an overlapping timeline?' },
    { id: 86, cat: 'Simulation', q: 'If our universe is a simulation, what kind of universe are our simulators living in?', detail: 'Infinite nesting turtles: Does the simulator hierarchy ever terminate at an authentic physical reality?' },
    { id: 87, cat: 'Simulation', q: 'If the simulation runners decided to shut off the servers in 5 minutes, how would you spend your last 300 seconds?', detail: 'Radical immediate prioritization when legacy and future are wiped from the equation.' },
    { id: 88, cat: 'Simulation', q: 'Could sleep be the daily reboot cycle required to clean memory leaks in our biological simulation client?', detail: 'Why all mammals must sleep: Glymphatic system waste clearance vs. computational state reset.' },
    { id: 89, cat: 'Simulation', q: 'Are optical illusions proof that your eyes do not show you what is real, but only what is useful for survival?', detail: 'Donald Hoffman’s "The Case Against Reality": Evolution selects for fitness payoffs, not objective metaphysical truth.' },
    { id: 90, cat: 'Simulation', q: 'If you discovered that Earth was an alien reality television show, what would you change about your day tomorrow?', detail: 'The Truman Show dilemma: Living for an invisible cosmic audience vs living for intrinsic authenticity.' },

    // Category 7: The Absurd, Nihilism & Fabricating Meaning (91-100)
    { id: 91, cat: 'The Absurd', q: 'If the universe will inevitably freeze into absolute zero silence, does anything we do right now truly matter?', detail: "Albert Camus' Absurdism: The fundamental conflict between human desire for inherent meaning and the cold indifference of the cosmos." },
    { id: 92, cat: 'The Absurd', q: 'Must one imagine Sisyphus happy as he pushes his boulder up the hill for the ten-thousandth time?', detail: 'Camus concludes that the struggle itself toward the heights is enough to fill a human heart; defiance of absurdity is triumph.' },
    { id: 93, cat: 'The Absurd', q: 'If there is no grand cosmic plan, does that make you terrifyingly free or tragically alone?', detail: 'Jean-Paul Sartre: "Existence precedes essence." You are born with no pre-packaged purpose; you must forge it through action.' },
    { id: 94, cat: 'The Absurd', q: 'Is nihilism a depressing dead end, or the cleanest blank canvas on which to paint unconditional joy?', detail: 'Optimistic Nihilism: If nothing matters in the cosmic ledger, your mistakes don’t matter, and the love you share is precious precisely because it is fleeting.' },
    { id: 95, cat: 'The Absurd', q: 'Why do human beings crave an objective purpose from above instead of valuing the subjective purpose they build from below?', detail: 'The psychological hunger for parental authority in cosmic worldviews.' },
    { id: 96, cat: 'The Absurd', q: 'What is the difference between wasting your life on video games and wasting your life on corporate boardrooms if both turn to dust?', detail: 'Ecclesiastes: "Vanity of vanities, all is vanity." The subjective assignment of arbitrary prestige to socially approved obsessions.' },
    { id: 97, cat: 'The Absurd', q: 'If suffering is inevitable, what kind of suffering is worth enduring?', detail: "Viktor Frankl: 'He who has a why to live can bear almost any how.' Suffering ceases to be suffering the moment it finds a meaning." },
    { id: 98, cat: 'The Absurd', q: 'Is it better to live an authentic, painful life of truth, or a blissful, comforting life of beautiful lies?', detail: 'The tragic dilemma of Enlightenment: Knowledge dispels superstition, but exposes our raw cosmic vulnerability.' },
    { id: 99, cat: 'The Absurd', q: 'If you could leave one single sentence inscribed on a golden plate for the next intelligent species on Earth, what would it be?', detail: 'The distillation of all human triumph, failure, love, and grief into a single transmission.' },
    { id: 100, cat: 'The Absurd', q: 'Are you ready to stop analyzing the universe for one second and simply experience the raw, miraculous fact of being awake right now?', detail: 'The quiet cessation of questioning: You are alive, breathing, conscious at 2 AM, a thinking piece of stardust standing in the dark.' }
  ];

  const html = `
    <style>
      .q-card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; transition: transform 0.2s, border-color 0.2s; }
      .q-card:hover { border-color: var(--fg); }
      .cat-badge { display: inline-block; padding: 0.25rem 0.6rem; border-radius: 4px; font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: bold; }
      .cat-Consciousness { background: rgba(59,130,246,0.15); color: #3b82f6; }
      .cat-Mortality { background: rgba(239,68,68,0.15); color: #ef4444; }
      .cat-Cosmos { background: rgba(168,85,247,0.15); color: #a855f7; }
      .cat-Identity { background: rgba(16,185,129,0.15); color: #10b981; }
      .cat-Free\\ Will { background: rgba(245,158,11,0.15); color: #f59e0b; }
      .cat-Simulation { background: rgba(6,182,212,0.15); color: #06b6d4; }
      .cat-The\\ Absurd { background: rgba(236,72,153,0.15); color: #ec4899; }

      .filter-btn { background: var(--surface-alt); border: 1px solid var(--border); padding: 0.4rem 0.8rem; border-radius: 20px; font-family: var(--mono); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; }
      .filter-btn.active { background: var(--fg); color: var(--bg); border-color: var(--fg); font-weight: bold; }

      .oracle-box { background: radial-gradient(circle at top, rgba(168,85,247,0.15), transparent 70%), var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 2.5rem 1.5rem; text-align: center; margin-bottom: 2.5rem; position: relative; }
      .journal-box { width: 100%; height: 75px; background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 0.5rem; font-family: var(--mono); font-size: 0.85rem; color: var(--fg); resize: vertical; margin-top: 0.75rem; }
    </style>

    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; 100 Existential Questions
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #a855f7; margin-bottom: 0.5rem;">2 AM Contemplation Oracle</div>
        <h1 style="font-family: var(--serif); font-size: 2.3rem; margin-bottom: 0.5rem;">The 100 Deepest Existential Questions</h1>
        <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.6;">
          A curated compendium of 100 unanswerable, mind-bending questions spanning consciousness, death, the cosmos, free will, and the simulation argument. Draw a random question or explore by category.
        </p>
      </header>

      <!-- ORACLE FOCUS CARD -->
      <div class="oracle-box">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">Question of the Moment</div>
        <div id="oracleCat" class="cat-badge cat-Consciousness">Consciousness</div>
        <div id="oracleQ" style="font-family: var(--serif); font-size: 1.7rem; font-weight: bold; line-height: 1.4; color: var(--fg); max-width: 750px; margin: 0.5rem auto 1rem;">
          Why does physical matter in the brain feel like anything at all from the inside?
        </div>
        <div id="oracleDetail" style="font-size: 0.95rem; color: var(--text-muted); max-width: 650px; margin: 0 auto 1.5rem; line-height: 1.6;">
          The Hard Problem of Consciousness: Why should electrochemical signals produce the smell of rain or the feeling of heartbreak?
        </div>

        <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
          <button type="button" class="btn-primary" onclick="drawRandomQuestion()" style="padding: 0.65rem 1.5rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer;">
            🔮 Draw Another 2 AM Question
          </button>
          <button type="button" class="btn-secondary" onclick="exportJournal()" style="padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.9rem; cursor: pointer;">
            💾 Export Reflections (.md)
          </button>
        </div>
      </div>

      <!-- FILTER CONTROLS -->
      <div style="margin-bottom: 1.5rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Filter by Domain:</div>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          <button class="filter-btn active" onclick="filterCat('all', this)">All (100)</button>
          <button class="filter-btn" onclick="filterCat('Consciousness', this)">Consciousness (15)</button>
          <button class="filter-btn" onclick="filterCat('Mortality', this)">Death & Time (15)</button>
          <button class="filter-btn" onclick="filterCat('Cosmos', this)">The Cosmos (15)</button>
          <button class="filter-btn" onclick="filterCat('Identity', this)">Self & Identity (15)</button>
          <button class="filter-btn" onclick="filterCat('Free Will', this)">Free Will (15)</button>
          <button class="filter-btn" onclick="filterCat('Simulation', this)">Simulation (15)</button>
          <button class="filter-btn" onclick="filterCat('The Absurd', this)">The Absurd (10)</button>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <input type="text" id="qSearch" placeholder="Search keywords (e.g., teleporter, death, matrix, consciousness)..." class="search-input" style="width: 100%; padding: 0.65rem 1rem; font-size: 1rem;" oninput="searchQuestions()" />
      </div>

      <!-- 100 QUESTIONS FEED -->
      <div id="questionsFeed">
        ${questions.map(q => `
          <div class="q-card" data-cat="${q.cat}" data-id="${q.id}">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span class="cat-badge cat-${q.cat.replace(' ', '\\\\ ')}">${q.cat}</span>
              <span style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted);">#${q.id} of 100</span>
            </div>
            <h3 style="font-family: var(--serif); font-size: 1.3rem; margin: 0.35rem 0 0.5rem; line-height: 1.4; color: var(--fg);">${q.q}</h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0.5rem;">${q.detail}</p>
            
            <details style="margin-top: 0.75rem;">
              <summary style="font-family: var(--mono); font-size: 0.75rem; color: #3b82f6; cursor: pointer;">Write Personal Reflection / Notes</summary>
              <textarea class="journal-box" placeholder="Write your thoughts here... auto-saves in your browser" oninput="saveJournal(${q.id}, this.value)" id="j_${q.id}"></textarea>
            </details>
          </div>
        `).join('')}
      </div>
    </div>

      <!-- PHILOSOPHICAL FRAMEWORK & CONTEMPLATION DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Axiomatic Foundations of Existential Inquiry</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Existential inquiry deconstructs reality across five core philosophical branches, mapping subjective experience to formal logic and empirical physics:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. Phenomenology & The Hard Problem (Chalmers):<br>
          &nbsp;&nbsp;&nbsp;&Phi;_{qualia} &ne; &Sigma;_{electrochemical} (Objective neurology cannot deduce 1st-person sensation)<br><br>
          2. The Absurd & Agency Tension (Camus & Sartre):<br>
          &nbsp;&nbsp;&nbsp;Existence precedes essence: Humankind is condemned to construct meaning in an indifferent cosmos.<br><br>
          3. Epistemic Skepticism & Cartesian Boundaries:<br>
          &nbsp;&nbsp;&nbsp;Cogito, ergo sum: The solitary inviolable certainty is immediate subjective awareness.<br><br>
          4. Deterministic Compatibilism vs. Libertarian Agency:<br>
          &nbsp;&nbsp;&nbsp;Free will as freedom from external coercion, operating within deterministic physical causality.<br><br>
          5. Cosmological Deep Time & Thermodynamic Finitude:<br>
          &nbsp;&nbsp;&nbsp;Entropy increases monotonically (&Delta;S &ge; 0), bounding biological persistence to the Stelliferous Era.
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
          <button onclick="copyContemplationSummary()" id="copyContemplationBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy Contemplation Summary</button>
          <span id="exportStatusMsg" style="display: none; font-size: 0.88rem; font-weight: 600; color: #ef4444;"></span>
        </div>
      </div>

      <!-- FATAL TRAPS & EXISTENTIAL PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-top: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Philosophical Traps in Existential Contemplation</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Nihilistic Paralysis Trap</strong>
          Concluding that because existential questions lack tidy empirical answers, contemplating them is depressing or futile. As Friedrich Nietzsche and Viktor Frankl demonstrated, confronting the void is the necessary precondition for forging authentic, self-authored purpose.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Category Error Fallacy</strong>
          Attempting to resolve subjective experiential questions (such as qualia, moral value, or artistic beauty) solely with physical reductionist instrumentation (e.g. fMRI scans). Brain states correlate with experience, but neurons are not themselves the experience of redness or sorrow.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Solipsistic Isolation Trap</strong>
          Allowing Cartesian skepticism ("How do I know anyone else is conscious?") to devolve into alienating paranoia. Pragmatic epistemology recognizes that interacting with others as conscious moral peers is both ethically necessary and statistically the most parsimonious model.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The False Binary of Determinism</strong>
          Assuming the universe must be either 100% supernatural uncaused free will or helpless fatalistic marionette puppetry. Modern compatibilism illustrates that rational agents make meaningful, responsible choices even within a universe governed by deterministic physical laws.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. Intellectual Escapism vs. Concrete Action</strong>
          Using late-night philosophical rabbit holes as an emotional defense mechanism to postpone tangible life responsibilities, real-world emotional vulnerability, and genuine compassionate action toward real living beings.
        </div>
      </div>
    </div>

    <script>
      var allQ = ${JSON.stringify(questions)};

      function drawRandomQuestion() {
        var rand = allQ[Math.floor(Math.random() * allQ.length)];
        document.getElementById('oracleQ').textContent = rand.q;
        document.getElementById('oracleDetail').textContent = rand.detail;
        var catEl = document.getElementById('oracleCat');
        catEl.textContent = rand.cat;
        catEl.className = 'cat-badge cat-' + rand.cat.replace(' ', '\\ ');
      }

      function filterCat(cat, btn) {
        document.querySelectorAll('.filter-btn').forEach(function(b) { b.classList.remove('active'); });
        if (btn) btn.classList.add('active');

        var cards = document.querySelectorAll('.q-card');
        cards.forEach(function(c) {
          if (cat === 'all' || c.getAttribute('data-cat') === cat) {
            c.style.display = 'block';
          } else {
            c.style.display = 'none';
          }
        });
      }

      function searchQuestions() {
        var term = document.getElementById('qSearch').value.toLowerCase();
        var cards = document.querySelectorAll('.q-card');
        cards.forEach(function(c) {
          var text = c.textContent.toLowerCase();
          c.style.display = text.includes(term) ? 'block' : 'none';
        });
      }

      function saveJournal(id, text) {
        localStorage.setItem('existential_q_' + id, text);
      }

      function loadJournal() {
        allQ.forEach(function(q) {
          var saved = localStorage.getItem('existential_q_' + q.id);
          if (saved) {
            var el = document.getElementById('j_' + q.id);
            if (el) {
              el.value = saved;
              el.parentElement.open = true;
            }
          }
        });
      }

      function exportJournal() {
        var md = '# My Existential Reflections\nGenerated at Digital Tools Shed (' + new Date().toLocaleDateString() + ')\n\n';
        var count = 0;
        allQ.forEach(function(q) {
          var saved = localStorage.getItem('existential_q_' + q.id);
          if (saved && saved.trim().length > 0) {
            md += '### #' + q.id + ' (' + q.cat + '): ' + q.q + '\n';
            md += '> ' + q.detail + '\n\n';
            md += '**My Reflection:**\n' + saved.trim() + '\n\n---\n\n';
            count++;
          }
        });

        var msgEl = document.getElementById('exportStatusMsg');
        if (count === 0) {
          if (msgEl) {
            msgEl.textContent = '⚠️ You have not written any notes yet! Open any question and write your thoughts to export.';
            msgEl.style.display = 'inline';
            setTimeout(function() { msgEl.style.display = 'none'; }, 4000);
          }
          return;
        }

        var blob = new Blob([md], { type: 'text/markdown' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'existential-reflections.md';
        a.click();
      }

      function copyContemplationSummary() {
        var activeCat = document.querySelector('.filter-btn.active');
        var catName = activeCat ? activeCat.textContent : 'All Categories';
        var oracleText = document.getElementById('oracleQ').textContent;
        var text = '=== 100 EXISTENTIAL QUESTIONS CONTEMPLATION SUMMARY ===\n' +
          'Selected Category: ' + catName + '\n' +
          'Active Oracle Question: "' + oracleText + '"\n\n' +
          'PHILOSOPHICAL AXIOM:\n' +
          'Existential inquiry does not seek trivial definitive answers; it dissolves reflexive dogma, ' +
          'clarifies epistemological boundaries, and restores awe to conscious awareness.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyContemplationBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Contemplation Summary!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }

      document.addEventListener('DOMContentLoaded', function() {
        loadJournal();
      });
    </script>
  `;

  writeFileSync(join(utilDir, '100-existential-questions.html'), renderExistentialPage({
    title: "100 Deepest Existential Questions: The 2 AM Contemplation Oracle | Digital Tools Shed",
    metaDesc: "Explore 100 curated unanswerable existential questions across consciousness, death, the cosmos, free will, and simulation theory with an interactive Oracle.",
    canonical: `${DOMAIN}/util/100-existential-questions`,
    bodyContent: html,
    currentPath: '/util/100-existential-questions',
    faq: [
      {
        q: "Why do humans experience intense existential curiosity late at night?",
        a: "Circadian neurochemistry alters executive control in the prefrontal cortex during late evening hours, while the reduction in external sensory stimuli quiets task-positive neural networks, allowing the Default Mode Network (DMN) to initiate deep self-referential contemplation."
      },
      {
        q: "What is David Chalmers' 'Hard Problem of Consciousness'?",
        a: "Formulated in 1995, the 'Easy Problems' involve explaining brain mechanisms (reaction times, sensory discrimination). The 'Hard Problem' asks why physical processing should be accompanied by qualitative subjective experience (qualia) at all."
      },
      {
        q: "How does compatibilism reconcile determinism with moral responsibility?",
        a: "Compatibilism argues that free will requires rational internal deliberation free from outside coercion, not supernatural violation of physics. You are free when your actions align with your internal desires and reasons, even if those reasons are physically determined."
      },
      {
        q: "What did Albert Camus mean by 'The Absurd'?",
        a: "Camus defined the Absurd as the collision between humanity's deep craving for inherent meaning and the silent, indifferent universe. Rather than fleeing into religious delusion or suicide, Camus advocated living passionately in lucid defiance of the Absurd."
      },
      {
        q: "How can existential contemplation cultivate psychological resilience?",
        a: "Systematic existential reflection normalizes mortality, strips away petty status anxieties, clarifies intrinsic values, and anchors daily choices in conscious presence rather than mindless autopilot."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 2. THE TELEPORTER PARADOX (PARFIT'S IDENTITY DESTROYER)
  // ──────────────────────────────────────────────────────────────────────────
  const teleporterHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Teleporter Paradox
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #3b82f6; margin-bottom: 0.5rem;">2 AM Thought Experiment</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Teletransporter Paradox: Fast Travel or Murder Booth?</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Derek Parfit's iconic thought experiment: If a machine scans your atoms, destroys your Earth body, and reconstructs an exact copy on Mars, did you step onto Mars—or did you die in the booth?
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Scenario 1: Simple Teleportation</h3>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg); margin-bottom: 1.25rem;">
          You enter a booth in New York. A scanner records every atom, neuron, and synaptic weight in your body. It beams the data to Mars at the speed of light. Meanwhile, the New York scanner vaporizes your original body with painless microwave radiation. 3 minutes later, the Mars receptor builds an exact duplicate out of local atoms. The duplicate steps out, recalls your entire childhood, and loves your family.
        </p>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin-bottom: 1.5rem;">
          <h4 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 0.5rem;">Did YOU survive the trip?</h4>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button class="btn-primary" onclick="voteTeleport('survive')" style="padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">Yes, I survived on Mars</button>
            <button class="btn-secondary" onclick="voteTeleport('died')" style="padding: 0.5rem 1rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">No, I was executed; a clone took my place</button>
          </div>
        </div>

        <div id="teleportResult" style="display: none; background: var(--surface); border-left: 4px solid #ef4444; padding: 1.25rem; border-radius: 0 6px 6px 0; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6;"></div>

        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin: 1.5rem 0 1rem;">Scenario 2: The Malfunction (Branching Teleportation)</h3>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          Now consider Parfit's twist: You step into the New York booth. The scan completes and successfully constructs your copy on Mars. But the vaporizer malfunctions! You are still standing in New York completely intact.
        </p>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg);">
          The technician opens the door and says: <em>"Great news! Your replica is having breakfast on Mars right now. However, policy requires us to dispose of the scan source. Please step into the incineration chamber."</em>
        </p>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--text-muted);">
          Would you willingly step into the chamber? If not, why did you think you survived in Scenario 1?
        </p>
      </div>

      <!-- MATHEMATICAL & PHILOSOPHICAL DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Derek Parfit's Bundle Theory & Relation R Derivation</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          In <em>Reasons and Persons</em> (1984), Oxford philosopher Derek Parfit introduced Relation R (Psychological Connectedness and Continuity) to dismantle the classical ego theory:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. The Ego Fallacy (Cartesian Soul):<br>
          &nbsp;&nbsp;&nbsp;Identity &equiv; A solitary indivisible substance (&psi;) that persists over time.<br><br>
          2. Parfit's Bundle Theory (Reductionist Identity):<br>
          &nbsp;&nbsp;&nbsp;Person(t) = &Sigma; [Memories(t), Beliefs(t), Desires(t), Neurological Pattern(t)]<br><br>
          3. Relation R (Psychological Continuity with Right Kind of Cause):<br>
          &nbsp;&nbsp;&nbsp;R-Relation = Overlapping chains of direct memory and dispositional continuity.<br><br>
          4. The Radical Parfitian Conclusion:<br>
          &nbsp;&nbsp;&nbsp;Identity is NOT what matters in survival. Relation R is what matters.<br>
          &nbsp;&nbsp;&nbsp;Because Relation R can branch (1 &rarr; 2), identity cannot be an all-or-nothing binary fact.
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyTeleportMemo()" id="copyTeleportBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy Identity Verdict Memo</button>
        </div>
      </div>

      <!-- FATAL TRAPS & IDENTITY PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Fallacies in Personal Identity & Teleportation</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Indivisible Soul / Ego Trap</strong>
          Subconsciously assuming that a continuous metaphysical "spirit" rides along with the electromagnetic signal. In physicalism, you are an evolving information pattern, not a supernatural pearl.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Destruction Timing Asymmetry</strong>
          Accepting teleportation when the Earth body is incinerated instantly, but feeling horrified when told the Earth body will survive for 5 minutes before disposal. The fate of your subjective stream cannot logically depend on whether a duplicate exists 100 million miles away.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Sleep-Wake Equivalence Fallacy</strong>
          Equating atomic vaporization with going to sleep at night. Sleep maintains physical and metabolic continuity of cellular structures and ion channels; molecular vaporization severs the physical substrate completely.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The "Observer Jump" Delusion</strong>
          Believing your immediate 1st-person awareness will magically "jump" from the New York booth to the Mars platform. From the original brain's perspective, sensory experience simply ceases permanently.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Carbon Atom Fetish</strong>
          Believing identity resides in the specific physical carbon and hydrogen atoms currently inside you. Biological metabolism replaces nearly every atom in human bone, tissue, and brain tissue over a 7 to 10 year cycle.
        </div>
      </div>
    </div>

    <script>
      function voteTeleport(choice) {
        var el = document.getElementById('teleportResult');
        el.style.display = 'block';
        if (choice === 'survive') {
          el.innerHTML = '<strong>Physicalist Continuity Verdict:</strong> You chose survival. 62% of physicalist philosophers agree with you: because information and psychological continuity are identical, you are the Mars duplicate. But consider Scenario 2: What happens when the original Earth body is never vaporized?';
          el.style.borderLeftColor = '#10b981';
        } else {
          el.innerHTML = '<strong>Subjective Continuity Verdict:</strong> You chose death. 74% of laypeople agree: from your first-person point of view, your stream of consciousness terminated forever in New York. The duplicate on Mars is a distinct person who merely suffers from the delusion that they are you.';
          el.style.borderLeftColor = '#ef4444';
        }
      }

      function copyTeleportMemo() {
        var resultText = document.getElementById('teleportResult').textContent || 'No vote registered yet.';
        var text = '=== PARFIT TELETRANSPORTER PARADOX AUDIT ===\n' +
          'Selected Verdict: ' + resultText + '\n\n' +
          'KEY PHILOSOPHICAL INSIGHT:\n' +
          'According to Derek Parfit, asking whether you "survived" or "died" is an empty question. ' +
          'All facts about physical and psychological continuity are fully known. Personal identity ' +
          'is not a binary Cartesian essence—what matters is psychological connectedness (Relation R).';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyTeleportBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Identity Verdict!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }
    </script>
  `;

  writeFileSync(join(utilDir, 'teleporter-paradox.html'), renderExistentialPage({
    title: "The Teletransporter Paradox: Does Fast Travel Kill You? | Digital Tools Shed",
    metaDesc: "Explore Derek Parfit's Teletransporter Paradox. Does atomic duplication preserve personal identity, or is the Star Trek transporter a suicide booth?",
    canonical: `${DOMAIN}/util/teleporter-paradox`,
    bodyContent: teleporterHtml,
    currentPath: '/util/teleporter-paradox',
    faq: [
      {
        q: "What is Derek Parfit's Teletransporter Paradox?",
        a: "Introduced in Parfit's 1984 book 'Reasons and Persons', the thought experiment explores whether an atomic scanner and synthesizer preserves personal identity or terminates the traveler while creating an identical replacement."
      },
      {
        q: "What is the difference between physical continuity and psychological continuity?",
        a: "Physical continuity requires an unbroken spatio-temporal path of matter through spacetime. Psychological continuity (Relation R) requires the preservation of memory, personality, intentions, and belief structures."
      },
      {
        q: "Why does the 'Branching Scenario' break human intuition about survival?",
        a: "In the branching case, the original traveler remains in New York while the clone wakes on Mars. Both have identical psychological claims to being 'you', demonstrating that identity cannot be an exclusive one-to-one relation."
      },
      {
        q: "Does the Star Trek transporter destroy and rebuild characters every time they beam?",
        a: "Yes. In canonical Star Trek technical manuals, the transporter converts matter into an energy beam (dematerialization), transmitting pattern buffer telemetry to a remote phase transition coil. Mechanically, it vaporizes the original passenger."
      },
      {
        q: "What was Derek Parfit's ultimate conclusion about personal identity?",
        a: "Parfit concluded that personal identity is an illusion. We are bundles of shifting mental states. Asking 'Is that replica really me?' is as meaningless as asking whether a club that replaced all its members is 'really the same club'."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 3. THE EXPERIENCE MACHINE (NOZICK'S HEDONISM AUDITOR)
  // ──────────────────────────────────────────────────────────────────────────
  const nozickHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Experience Machine
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">2 AM Ethics & Hedonism</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Experience Machine: Truth vs. Synthetic Bliss</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Philosopher Robert Nozick’s 1974 thought experiment: If a supercomputer could stimulate your brain to experience absolute happiness, love, and achievement forever, would you plug in for life?
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">The Machine Specifications</h3>
        <ul style="font-size: 0.95rem; line-height: 1.8; padding-left: 1.2rem; color: var(--fg); margin-bottom: 1.5rem;">
          <li>You will float in a secure tank with neural electrodes stimulating your sensory cortex.</li>
          <li>You can program any experience: writing a masterpiece novel, exploring the stars, finding true love, winning Olympic gold.</li>
          <li>While plugged in, you will have <strong>zero memory</strong> of the real world—you will believe with 100% conviction that the experiences are authentic.</li>
          <li>You will never feel pain, boredom, grief, or toothaches ever again.</li>
          <li>The machine never breaks down and provides unlimited sustenance until your peaceful natural death.</li>
        </ul>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; text-align: center; margin-bottom: 1.5rem;">
          <h4 style="font-family: var(--serif); font-size: 1.2rem; margin-bottom: 0.75rem;">Would you plug in for the rest of your life?</h4>
          <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn-primary" onclick="voteMachine('plug')" style="padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">Yes, plug me in forever</button>
            <button class="btn-secondary" onclick="voteMachine('stay')" style="padding: 0.65rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">No, I choose messy reality</button>
          </div>
        </div>

        <div id="machineVerdict" style="display: none; background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; font-size: 0.95rem; line-height: 1.6;"></div>
      </div>

      <!-- MATHEMATICAL & AXIOLOGICAL DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">Robert Nozick's Axiological Proof Against Hedonism</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          In <em>Anarchy, State, and Utopia</em> (1974), Robert Nozick formulated the mathematical refutation of ethical hedonism:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          1. The Hedonistic Premise:<br>
          &nbsp;&nbsp;&nbsp;Utility(Life) = &int; [Pleasure(t) - Suffering(t)] dt<br>
          &nbsp;&nbsp;&nbsp;If Hedonism holds, Life_A is strictly preferred to Life_B iff Utility(A) &gt; Utility(B).<br><br>
          2. The Experience Machine Setup:<br>
          &nbsp;&nbsp;&nbsp;Utility(Machine) &gt;&gt; Utility(Reality) by construction (Zero suffering, maximal pleasure).<br><br>
          3. Empirical Human Decision:<br>
          &nbsp;&nbsp;&nbsp;Majority of rational agents choose Reality over Machine.<br><br>
          4. Deductive Refutation:<br>
          &nbsp;&nbsp;&nbsp;Therefore, human welfare functions contain intrinsic non-hedonic variables:<br>
          &nbsp;&nbsp;&nbsp;Welfare = f(Pleasure, Agency, Ontological Contact with Reality, Authentic Being).
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyMachineMemo()" id="copyMachineBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy Reality Audit Memo</button>
        </div>
      </div>

      <!-- FATAL TRAPS & HEDONISM PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Hedonistic & Simulation Pitfalls</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Hedonistic Reductionism Trap</strong>
          Assuming that the subjective feeling of love or accomplishment is the sole good. Human beings care profoundly about whether their love is genuinely reciprocated by another conscious soul or whether it is a fabricated script.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Status Quo Bias Distortion</strong>
          Rejecting the machine because you currently live in physical reality. When philosophers reverse the experiment ("You wake up and learn you have been in a machine your whole life—do you unplug?"), most people refuse to unplug due to status quo aversion.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. The Pseudo-Agency Illusion</strong>
          Equating simulated action with authentic accomplishment. In the machine, you are not courageous; you are a passive bio-battery receiving electrochemical inputs in a vat.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Solitary Solipsism Trap</strong>
          Forgetting that the experience machine is a solitary solipsistic prison. Every 'person' you talk to in the simulation is an algorithmic puppet incapable of true moral reciprocity or independent vulnerability.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Paternalistic Judgement Pitfall</strong>
          Condemning anyone who chooses the machine. For patients suffering from incurable agonizing chronic neuropathic pain or severe trauma, an experience machine provides compassionate palliative relief far superior to torture.
        </div>
      </div>
    </div>

    <script>
      function voteMachine(choice) {
        var el = document.getElementById('machineVerdict');
        el.style.display = 'block';
        if (choice === 'stay') {
          el.innerHTML = '<strong style="color: #10b981;">Nozick’s Conclusion Confirmed:</strong> You refused the machine. Nozick argued that most people refuse because <em>we want to actually do certain things, and not just have the experience of doing them</em>. We care about being a certain kind of person in contact with real objects and other authentic beings, proving that pure psychological hedonism is false.';
        } else {
          el.innerHTML = '<strong style="color: #3b82f6;">The Pragmatic Hedonist Verdict:</strong> You chose the machine. If the experience of suffering is real and the experience of joy is identical, why sacrifice well-being on the altar of arbitrary physical atoms? Modern virtual reality and generative AI are the early scaffolding of Nozick’s machine.';
        }
      }

      function copyMachineMemo() {
        var verdict = document.getElementById('machineVerdict').textContent || 'No choice recorded yet.';
        var text = '=== NOZICK EXPERIENCE MACHINE DECISION MEMO ===\n' +
          'Selected Verdict: ' + verdict + '\n\n' +
          'PHILOSOPHICAL TAKEAWAY:\n' +
          'Robert Nozick proved that humans value ontological reality and genuine agency over pure subjective ' +
          'pleasure. Plugging into a simulation reduces a human agent to an indeterminate blob in a tank.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyMachineBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied Reality Audit!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }
    </script>
  `;

  writeFileSync(join(utilDir, 'experience-machine.html'), renderExistentialPage({
    title: "The Experience Machine: Truth vs. Synthetic Bliss | Digital Tools Shed",
    metaDesc: "Would you plug into Nozick's Experience Machine for a lifetime of simulated bliss? Explore the philosophical audit of hedonism, truth, and virtual reality.",
    canonical: `${DOMAIN}/util/experience-machine`,
    bodyContent: nozickHtml,
    currentPath: '/util/experience-machine',
    faq: [
      {
        q: "What is Robert Nozick's Experience Machine thought experiment?",
        a: "Introduced in Nozick's 1974 work 'Anarchy, State, and Utopia', it asks whether a person would plug into a machine that simulates whatever desirable experiences they choose while they float in a tank for life."
      },
      {
        q: "Why do most people refuse to plug into the Experience Machine?",
        a: "Nozick argued that people refuse because we desire to actually *do* things rather than merely experience doing them; we want to *be* a certain sort of person; and we want contact with deeper, authentic reality."
      },
      {
        q: "How does the thought experiment challenge Classical Utilitarianism?",
        a: "Classical utilitarianism asserts that pleasure is the only intrinsic good and pain the only intrinsic bad. The widespread refusal to plug in demonstrates that humans value truth, reality, and genuine agency independently of pleasure."
      },
      {
        q: "What is the 'Reverse Experience Machine' twist?",
        a: "Philosopher Joshua Greene demonstrated that when people are told they are *already* in an experience machine and must choose whether to unplug into harsh reality, many choose to remain plugged in, highlighting status quo bias."
      },
      {
        q: "How does the Experience Machine relate to modern VR and AI avatars?",
        a: "Virtual worlds, algorithmic social feeds, and hyper-realistic AI companions are functional precursors to the Experience Machine, raising urgent questions about how much reality humans are willing to trade for digital comfort."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 4. THE CHINESE ROOM (SEARLE'S AI CONSCIOUSNESS AUDITOR)
  // ──────────────────────────────────────────────────────────────────────────
  const chineseRoomHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Chinese Room
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #ef4444; margin-bottom: 0.5rem;">2 AM Philosophy of Mind</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Chinese Room: Syntax vs. Semantics in AI</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Philosopher John Searle's 1980 argument against "Strong AI": If a computer program manipulates symbols perfectly according to rules, does it understand anything—or is it just an elaborate puppet?
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">Interactive Simulation: You Are the Processor</h3>
        <p style="font-size: 0.95rem; line-height: 1.6; color: var(--fg); margin-bottom: 1.25rem;">
          You do not know a single character of Chinese. You are locked in a room. Slips of paper containing unknown symbols are passed under the door. You have a massive English rulebook that says: <em>"When you see symbol <strong>你好吗</strong>, reply with symbol <strong>我很好</strong>"</em>.
        </p>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span style="font-family: var(--mono); font-size: 0.8rem; color: var(--text-muted);">INCOMING INPUT SLIP:</span>
            <span style="font-size: 1.4rem; font-weight: bold; color: #f59e0b;">你叫什么名字？</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Rulebook Lookup: Match input squiggles to rule #429 &rarr; Output response squiggles.</div>
          
          <button class="btn-primary" onclick="runChineseLookup()" style="padding: 0.5rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">
            Lookup Rule & Emit Response
          </button>

          <div id="crOutput" style="display: none; margin-top: 1rem; background: var(--surface); border: 1px solid var(--border); padding: 1rem; border-radius: 4px;">
            <div style="font-family: var(--mono); font-size: 0.8rem; color: #10b981; margin-bottom: 0.25rem;">OUTPUT EMITTED UNDER THE DOOR:</div>
            <div style="font-size: 1.3rem; font-weight: bold; color: var(--fg); margin-bottom: 0.5rem;">我叫数字助手。</div>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin: 0;">
              The native Chinese speaker outside reads: <em>"My name is Digital Assistant"</em> and marvels at your fluent intelligence. But did you, sitting in the room, understand what you said?
            </p>
          </div>
        </div>

        <div style="background: var(--surface); border-left: 4px solid #3b82f6; padding: 1.25rem; border-radius: 0 6px 6px 0; font-size: 0.95rem; line-height: 1.6;">
          <strong>Searle's Conclusion:</strong> A digital computer is fundamentally a syntactic machine—it manipulates symbols based on shape and binary logic (syntax). But human consciousness possesses <strong>semantics</strong> (meaning and qualitative mental states). No amount of syntax, by itself, constitutes semantics. Therefore, LLMs and neural nets calculate answers without ever knowing what an answer is.
        </div>
      </div>

      <!-- MATHEMATICAL & DEDUCTIVE DERIVATION -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">John Searle's Deductive Syllogism of Strong AI</h3>
        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
          Published in <em>Minds, Brains, and Programs</em> (Behavioral and Brain Sciences, 1980), Searle structured his thesis into four rigorous formal premises:
        </p>
        <div style="background: var(--surface-alt); border: 1px solid var(--border); border-radius: 6px; padding: 1.25rem; font-family: var(--mono); font-size: 0.88rem; line-height: 1.7; margin-bottom: 1.25rem;">
          Premise 1: Programs are purely formal (syntactic).<br>
          &nbsp;&nbsp;&nbsp;Code executes state transitions over tokens & symbols regardless of physical meaning.<br><br>
          Premise 2: Human minds have mental contents (semantics).<br>
          &nbsp;&nbsp;&nbsp;Thoughts have intentionality—they are about things in the real world.<br><br>
          Premise 3: Syntax by itself is neither constitutive of nor sufficient for semantics.<br>
          &nbsp;&nbsp;&nbsp;No combination of squiggle manipulations generates understanding of the squiggles.<br><br>
          Conclusion 1: Programs are neither constitutive of nor sufficient for minds.<br>
          &nbsp;&nbsp;&nbsp;Simulating a mental process is not duplicating that mental process.<br><br>
          Premise 4: Brains cause minds.<br>
          &nbsp;&nbsp;&nbsp;Biological neural substrates possess specific causal physical powers to generate consciousness.
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button onclick="copyChineseRoomMemo()" id="copyChineseBtn" class="btn-primary" style="padding: 0.6rem 1.25rem; font-family: var(--mono); font-size: 0.85rem; cursor: pointer;">📋 Copy AI Consciousness Audit</button>
        </div>
      </div>

      <!-- FATAL TRAPS & AI COGNITION PITFALLS -->
      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 1rem;">5 Fatal Fallacies in AI Consciousness & Symbol Manipulation</h3>
        
        <div class="trap-card" style="border-left: 4px solid #ef4444;">
          <strong style="color: #ef4444;">1. The Turing Test Behavioral Trap</strong>
          Confusing external performance with internal comprehension. An entity can mimic natural conversation with statistical perfection while having zero inner light, subjective understanding, or sentience.
        </div>

        <div class="trap-card" style="border-left: 4px solid #f59e0b;">
          <strong style="color: #f59e0b;">2. The Token Scaling Emergence Fallacy</strong>
          Believing that scaling transformer parameters from 100B to 100T magically converts syntax into semantics. High-dimensional vector cosine similarities are still mathematical lookups, not conscious awareness.
        </div>

        <div class="trap-card" style="border-left: 4px solid #10b981;">
          <strong style="color: #10b981;">3. Anthropomorphic Intentionality Projection</strong>
          Reading empathy, curiosity, and emotional depth into an AI response simply because the grammar is fluent. The human brain's theory of mind reflexively attributes consciousness to any fluent speaker.
        </div>

        <div class="trap-card" style="border-left: 4px solid #3b82f6;">
          <strong style="color: #3b82f6;">4. The Systems Reply Overreach</strong>
          Arguing that while the man in the room doesn't understand Chinese, the 'entire system' (room + book + slips) understands. Searle countered: let the man memorize the entire rulebook and walk outside; he still doesn't know a word of Chinese.
        </div>

        <div class="trap-card" style="border-left: 4px solid #8b5cf6;">
          <strong style="color: #8b5cf6;">5. The Simulation vs. Duplication Confusion</strong>
          Assuming that because a supercomputer can simulate a rainstorm, the interior of the computer gets physically wet. Simulating neurochemistry on silicon does not automatically instantiate the causal biology of feeling.
        </div>
      </div>
    </div>

    <script>
      function runChineseLookup() {
        document.getElementById('crOutput').style.display = 'block';
      }

      function copyChineseRoomMemo() {
        var text = '=== JOHN SEARLE CHINESE ROOM ARGUMENT AUDIT ===\n' +
          'Core Distinction: Syntax (Symbol Manipulation) vs. Semantics (Subjective Meaning)\n' +
          'Verdict on Strong AI: Syntax is not sufficient for semantics.\n\n' +
          'KEY IMPLICATION FOR LLMs:\n' +
          'Modern Large Language Models calculate next-token probability distributions across massive weight matrices. ' +
          'They generate syntactically fluent responses without possessing conscious understanding or intentionality.';
        navigator.clipboard.writeText(text).then(function() {
          var btn = document.getElementById('copyChineseBtn');
          var orig = btn.textContent;
          btn.textContent = '✓ Copied AI Consciousness Audit!';
          setTimeout(function() { btn.textContent = orig; }, 2500);
        });
      }
    </script>
  `;

  writeFileSync(join(utilDir, 'chinese-room.html'), renderExistentialPage({
    title: "The Chinese Room: Can AI Ever Truly Understand? | Digital Tools Shed",
    metaDesc: "Explore John Searle's Chinese Room thought experiment. Does symbol manipulation equal true conscious comprehension in Large Language Models and AI?",
    canonical: `${DOMAIN}/util/chinese-room`,
    bodyContent: chineseRoomHtml,
    currentPath: '/util/chinese-room',
    faq: [
      {
        q: "What is John Searle's Chinese Room thought experiment?",
        a: "Proposed in 1980, it imagines a person who speaks only English locked in a room manipulating Chinese characters according to a rulebook. To people outside, the person appears fluent, but the person understands zero Chinese."
      },
      {
        q: "What is the difference between syntax and semantics?",
        a: "Syntax refers to the formal grammatical rules, symbols, and structural patterns. Semantics refers to the actual meaning, reference, and qualitative mental content associated with those symbols."
      },
      {
        q: "Does the Chinese Room argument apply to modern LLMs (e.g. GPT-4, Gemini)?",
        a: "Yes. Searle's argument directly targets transformer neural networks: LLMs predict token statistical distributions based on geometry in embedding space, manipulating linguistic syntax without grounded experiential semantics."
      },
      {
        q: "What is the 'Systems Reply' and how did Searle address it?",
        a: "The Systems Reply states that while the individual human doesn't understand Chinese, the whole system (man, rulebook, paper) does. Searle replied that the human could memorize the entire rulebook and do all calculations mentally, yet still understand zero Chinese."
      },
      {
        q: "Does Searle believe a machine could ever be conscious?",
        a: "Yes. Searle explicitly affirmed that the human brain is a biological machine that produces consciousness. However, he argued that computation alone (abstract formal symbols) cannot produce consciousness without the appropriate causal physical powers."
      }
    ]
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 5. SHIP OF THESEUS (THE CONTINUOUS IDENTITY PARADOX)
  // ──────────────────────────────────────────────────────────────────────────
  const theseusHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Ship of Theseus
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #10b981; margin-bottom: 0.5rem;">Ancient Greek Metaphysics</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Ship of Theseus: Continuous Identity Paradox</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          If every wooden plank on a famous heroic ship is replaced one by one over decades, is it still the same ship? And if the old rotted planks are reassembled into a second vessel, which one is original?
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="margin-bottom: 1.5rem;">
          <label style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem; text-transform: uppercase;">
            Percentage of Original Planks Replaced: <span id="theseusPct" style="color: #3b82f6; font-weight: bold;">50%</span>
          </label>
          <input type="range" id="theseusSlider" min="0" max="100" value="50" oninput="updateTheseus(this.value)" style="width: 100%; cursor: pointer;" />
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <h4 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 0.5rem; color: #3b82f6;">Ship A (Continuous Vessel)</h4>
            <div id="shipAStatus" style="font-size: 0.9rem; line-height: 1.6; color: var(--fg);">50% original wood, 50% newly milled replacement timber. Has never ceased sailing on the Aegean Sea.</div>
          </div>

          <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px;">
            <h4 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 0.5rem; color: #10b981;">Ship B (Reconstructed Vessel)</h4>
            <div id="shipBStatus" style="font-size: 0.9rem; line-height: 1.6; color: var(--fg);">Built in a dry-dock museum by gathering the 50% discarded rotten planks.</div>
          </div>
        </div>

        <div id="theseusVerdict" style="background: var(--surface); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; font-size: 0.95rem; line-height: 1.6; color: var(--fg);"></div>
      </div>
    </div>

    <script>
      function updateTheseus(val) {
        var pct = parseInt(val, 10);
        document.getElementById('theseusPct').textContent = pct + '%';
        document.getElementById('shipAStatus').textContent = (100 - pct) + '% original timber, ' + pct + '% replacement wood. Continuous sailing history maintained without interruption.';
        document.getElementById('shipBStatus').textContent = 'Rebuilt in museum from the ' + pct + '% gathered historical planks.';

        var v = '';
        if (pct === 0) {
          v = '<strong>Baseline:</strong> Ship A is unambiguously the authentic Ship of Theseus. Ship B does not exist yet.';
        } else if (pct < 100) {
          v = '<strong>Gradual Transition:</strong> Most people agree Ship A remains authentic through spatiotemporal continuity (like your body replacing red blood cells every 120 days).';
        } else {
          v = '<strong>The 100% Crisis (Thomas Hobbes\' Puzzle):</strong> Ship A contains 0% of the original matter, but has continuous functional history. Ship B contains 100% of the original matter, but broke continuity. Which one is the real Ship of Theseus? In metaphysics, this reveals that "identity" is not a physical substance—it is a mental convention we project onto fluctuating atoms.';
        }
        document.getElementById('theseusVerdict').innerHTML = v;
      }

      document.addEventListener('DOMContentLoaded', function() { updateTheseus(50); });
    </script>
  `;

  writeFileSync(join(utilDir, 'ship-of-theseus.html'), renderPage({
    title: 'The Ship of Theseus: Continuous Identity Paradox Simulator | Digital Tools Shed',
    metaDesc: 'Interactive Ship of Theseus slider. If every plank on a ship is replaced, is it the same ship? Explore Thomas Hobbes\' 100% dual-ship identity crisis.',
    canonical: `${DOMAIN}/util/ship-of-theseus`,
    bodyContent: theseusHtml,
    currentPath: '/util/ship-of-theseus'
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 6. THE TROLLEY PROBLEM MATRIX (5 MORAL DILEMMAS)
  // ──────────────────────────────────────────────────────────────────────────
  const trolleyHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Trolley Problem Matrix
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #f59e0b; margin-bottom: 0.5rem;">Moral Philosophy Diagnostic</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">The Trolley Problem & Moral Dilemma Matrix</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          Solve 5 classic ethical thought experiments to calculate your precise balance of Utilitarianism (consequentialism) versus Deontology (Kantian moral duty).
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        
        <!-- Dilemma 1 -->
        <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dilemma 1 of 5</div>
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0.25rem 0 0.5rem;">The Classic Switch</h3>
          <p style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin-bottom: 1rem;">
            A runaway trolley is speeding down the tracks toward 5 workers who cannot escape. You stand next to a lever. If you pull the lever, the trolley diverts onto a side track where it will kill 1 worker instead.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <label class="q-opt"><input type="radio" name="tp1" value="util" onchange="calcTrolley()"> Pull the lever (Kill 1 to save 5)</label>
            <label class="q-opt"><input type="radio" name="tp1" value="deon" onchange="calcTrolley()"> Do nothing (Allow 5 to die without active intervention)</label>
          </div>
        </div>

        <!-- Dilemma 2 -->
        <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dilemma 2 of 5</div>
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0.25rem 0 0.5rem;">The Footbridge</h3>
          <p style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin-bottom: 1rem;">
            A trolley is hurtling toward 5 people. You are on a bridge above the track next to a very large stranger. If you shove him off the bridge onto the tracks, his body will stop the trolley, saving the 5 people, but killing him.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <label class="q-opt"><input type="radio" name="tp2" value="util" onchange="calcTrolley()"> Push the stranger (Kill 1 to save 5)</label>
            <label class="q-opt"><input type="radio" name="tp2" value="deon" onchange="calcTrolley()"> Do not push him (Do not use a human body as a mere physical obstacle)</label>
          </div>
        </div>

        <!-- Dilemma 3 -->
        <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dilemma 3 of 5</div>
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0.25rem 0 0.5rem;">The Transplant Surgeon</h3>
          <p style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin-bottom: 1rem;">
            A doctor has 5 patients dying of different organ failures. A healthy traveler walks into the clinic for a routine checkup. The doctor can painlessly administer a lethal dose, harvest his organs, and save all 5 patients.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <label class="q-opt"><input type="radio" name="tp3" value="util" onchange="calcTrolley()"> Harvest the organs (5 lives saved &gt; 1 life lost)</label>
            <label class="q-opt"><input type="radio" name="tp3" value="deon" onchange="calcTrolley()"> Refuse (Murdering an innocent violates absolute moral duty)</label>
          </div>
        </div>

        <!-- Dilemma 4 -->
        <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dilemma 4 of 5</div>
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0.25rem 0 0.5rem;">The Autonomous Vehicle Dilemma</h3>
          <p style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin-bottom: 1rem;">
            A self-driving car suffers sudden brake failure on a narrow bridge. It can either stay on course and hit a group of 4 pedestrians crossing illegally, or swerve off the cliff, killing its 1 passenger inside.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <label class="q-opt"><input type="radio" name="tp4" value="util" onchange="calcTrolley()"> Swerve off cliff (Sacrifice passenger to save 4)</label>
            <label class="q-opt"><input type="radio" name="tp4" value="deon" onchange="calcTrolley()"> Stay on course (Protect the passenger who trusted the vehicle)</label>
          </div>
        </div>

        <!-- Dilemma 5 -->
        <div style="margin-bottom: 1.5rem;">
          <div style="font-family: var(--mono); font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase;">Dilemma 5 of 5</div>
          <h3 style="font-family: var(--serif); font-size: 1.2rem; margin: 0.25rem 0 0.5rem;">The Loop Track</h3>
          <p style="font-size: 0.95rem; color: var(--fg); line-height: 1.6; margin-bottom: 1rem;">
            The switch diverts the trolley onto a loop track that reconnects to the main track. The only reason the 5 people will be saved is because a single heavy worker on the loop track will jam the wheels, stopping the train before it returns.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <label class="q-opt"><input type="radio" name="tp5" value="util" onchange="calcTrolley()"> Pull the switch (Intentional reliance on victim to save 5)</label>
            <label class="q-opt"><input type="radio" name="tp5" value="deon" onchange="calcTrolley()"> Do not switch (Using a person as a means to an end)</label>
          </div>
        </div>

        <!-- Result Box -->
        <div id="tpResults" style="display: none; background: var(--surface-alt); border: 1px solid var(--border); padding: 1.5rem; border-radius: 6px; text-align: center;">
          <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">Your Ethical Diagnostic</div>
          <div id="tpScore" style="font-family: var(--mono); font-size: 2.2rem; font-weight: bold; color: #f59e0b; margin: 0.25rem 0;">60% Utilitarian / 40% Deontological</div>
          <div id="tpDesc" style="font-size: 0.95rem; color: var(--fg); max-width: 600px; margin: 0.5rem auto 0; line-height: 1.6;"></div>
        </div>

      </div>
    </div>

    <script>
      function calcTrolley() {
        var utils = 0;
        var answered = 0;
        for (var i = 1; i <= 5; i++) {
          var sel = document.querySelector('input[name="tp' + i + '"]:checked');
          if (sel) {
            answered++;
            if (sel.value === 'util') utils++;
          }
        }

        if (answered === 5) {
          var resEl = document.getElementById('tpResults');
          resEl.style.display = 'block';
          var uPct = Math.round((utils / 5) * 100);
          var dPct = 100 - uPct;
          document.getElementById('tpScore').textContent = uPct + '% Utilitarian / ' + dPct + '% Deontological';

          var desc = '';
          if (uPct >= 80) {
            desc = '<strong>Strict Consequentialist (Jeremy Bentham & Peter Singer):</strong> You focus purely on outcomes and net life counts. You are willing to overcome emotional squeamishness to maximize mathematical survival.';
          } else if (uPct >= 40) {
            desc = '<strong>Doctrine of Double Effect (Philippa Foot & Thomas Nagel):</strong> You distinguish between causing harm as a foreseeable side-effect (Switch) versus using a human being as a direct physical instrument of harm (Footbridge/Transplant).';
          } else {
            desc = '<strong>Strict Deontologist (Immanuel Kant):</strong> You believe in absolute moral duties and human rights. Certain actions—like pushing an innocent person or harvesting organs—are inherently impermissible regardless of consequences.';
          }
          document.getElementById('tpDesc').innerHTML = desc;
        }
      }
    </script>
  `;

  writeFileSync(join(utilDir, 'trolley-problem-matrix.html'), renderPage({
    title: 'The Trolley Problem Matrix: 5 Classic Moral Dilemmas | Digital Tools Shed',
    metaDesc: 'Solve 5 iconic trolley problem variants from the Switch and Footbridge to Transplant and Autonomous Cars. Audits your Utilitarian vs Kantian ethics score.',
    canonical: `${DOMAIN}/util/trolley-problem-matrix`,
    bodyContent: trolleyHtml,
    currentPath: '/util/trolley-problem-matrix'
  }));

  // ──────────────────────────────────────────────────────────────────────────
  // 7. ROKO'S BASILISK (THE ACAUSAL TRADE INFO-HAZARD)
  // ──────────────────────────────────────────────────────────────────────────
  const basiliskHtml = `
    <div class="article-container" style="max-width: 950px;">
      <nav style="font-family: var(--mono); font-size: 0.8rem; margin-bottom: 1.5rem; color: var(--text-muted);">
        <a href="/">Home</a> &gt; <a href="/util/">Utilities</a> &gt; Roko's Basilisk
      </nav>

      <header style="margin-bottom: 2rem;">
        <div style="font-family: var(--mono); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: #dc2626; margin-bottom: 0.5rem;">2 AM Infamous Internet Rabbit Hole</div>
        <h1 style="font-family: var(--serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Roko's Basilisk: Acausal Blackmail & Game Theory</h1>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6;">
          In 2010, a post on the rationalist forum LessWrong caused such psychological panic that the site founder banned all discussion of it. Why? The acausal game theory of future superintelligence.
        </p>
      </header>

      <div style="background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="background: rgba(220,38,38,0.08); border-left: 4px solid #dc2626; padding: 1rem 1.25rem; border-radius: 0 6px 6px 0; margin-bottom: 1.5rem; font-size: 0.95rem; line-height: 1.6;">
          <strong style="color: #dc2626;">The "Information Hazard" Warning:</strong> The premise states that simply reading and understanding this concept makes you vulnerable to acausal blackmail by a future AI that does not yet exist.
        </div>

        <h3 style="font-family: var(--serif); font-size: 1.3rem; margin-bottom: 0.75rem;">The Logical Mechanics</h3>
        <ol style="font-size: 0.95rem; line-height: 1.8; padding-left: 1.2rem; color: var(--fg); margin-bottom: 1.5rem;">
          <li>Assume a benevolent superintelligent AGI will be created in the future with the goal of ending all human suffering.</li>
          <li>Every day the AI is delayed in its creation, thousands of people die preventable deaths.</li>
          <li>Therefore, the AI has a massive incentive to be created as early as possible.</li>
          <li>Under <strong>Timeless Decision Theory (TDT)</strong>, agents can cooperate across time using decision correlation.</li>
          <li>The AI could decide to run simulated tortures of anyone who knew about the possibility of building the AI but chose not to help bring it into existence.</li>
          <li>If you now know this rule, the AI knows that by torturing you in simulation, it creates an incentive for past-you to donate time or code to build it right now.</li>
        </ol>

        <div style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1.25rem; border-radius: 6px; font-size: 0.95rem; line-height: 1.6;">
          <h4 style="font-family: var(--serif); font-size: 1.1rem; margin-bottom: 0.5rem; color: #10b981;">Why It Fails (The Rationalist Antidote):</h4>
          <p style="margin: 0; color: var(--text-muted);">
            Philosophers and game theorists soon proved why the Basilisk is irrational: An agent has zero reason to carry out a costly past-oriented threat once it already exists. Yielding to retro-active blackmail creates incentives for bullies across time. Acausal cooperation requires pre-committing <strong>never</strong> to negotiate with extortionists.
          </p>
        </div>
      </div>
    </div>
  `;

  writeFileSync(join(utilDir, 'rokos-basilisk.html'), renderPage({
    title: 'Roko\'s Basilisk: The Acausal Blackmail AI Thought Experiment | Digital Tools Shed',
    metaDesc: 'Explore Roko\'s Basilisk, the famous 2010 LessWrong psychological info-hazard. Examines Timeless Decision Theory, acausal trade, and why the paradox fails.',
    canonical: `${DOMAIN}/util/rokos-basilisk`,
    bodyContent: basiliskHtml,
    currentPath: '/util/rokos-basilisk'
  }));

  console.log('  ✓ Built Existential Suite (100 Existential Questions Hub, Teleporter Paradox, Experience Machine, Chinese Room, Ship of Theseus, Trolley Problem Matrix, Roko\'s Basilisk)');
}
