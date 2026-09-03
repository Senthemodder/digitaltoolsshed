import { writeFileSync } from 'fs';
import { join } from 'path';
import { DIST, DOMAIN, renderPage, ensureDir } from './core.js';

export function buildExistentialSuite() {
  const utilDir = join(DIST, 'util');
  ensureDir(utilDir);

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

    <script>
      var allQ = ${JSON.stringify(questions)};

      function drawRandomQuestion() {
        var rand = allQ[Math.floor(Math.random() * allQ.length)];
        document.getElementById('oracleQ').textContent = rand.q;
        document.getElementById('oracleDetail').textContent = rand.detail;
        var catEl = document.getElementById('oracleCat');
        catEl.textContent = rand.cat;
        catEl.className = 'cat-badge cat-' + rand.cat.replace(' ', '\\\\ ');
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
        var md = '# My Existential Reflections\\nGenerated at Digital Tools Shed (' + new Date().toLocaleDateString() + ')\\n\\n';
        var count = 0;
        allQ.forEach(function(q) {
          var saved = localStorage.getItem('existential_q_' + q.id);
          if (saved && saved.trim().length > 0) {
            md += '### #' + q.id + ' (' + q.cat + '): ' + q.q + '\\n';
            md += '> ' + q.detail + '\\n\\n';
            md += '**My Reflection:**\\n' + saved.trim() + '\\n\\n---\\n\\n';
            count++;
          }
        });

        if (count === 0) {
          alert('You have not written any notes yet! Open any question and write your reflections to export.');
          return;
        }

        var blob = new Blob([md], { type: 'text/markdown' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'existential-reflections.md';
        a.click();
      }

      document.addEventListener('DOMContentLoaded', function() {
        loadJournal();
      });
    </script>
  `;

  writeFileSync(join(utilDir, '100-existential-questions.html'), renderPage({
    title: '100 Deepest Existential Questions: The 2 AM Contemplation Oracle | Digital Tools Shed',
    metaDesc: 'Explore 100 curated unanswerable existential questions across consciousness, death, the cosmos, free will, and simulation theory with an interactive Oracle.',
    canonical: `${DOMAIN}/util/100-existential-questions`,
    bodyContent: html,
    currentPath: '/util/100-existential-questions'
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
    </div>

    <script>
      function voteTeleport(choice) {
        var el = document.getElementById('teleportResult');
        el.style.display = 'block';
        if (choice === 'survive') {
          el.innerHTML = '<strong>Physicalist Continuity Verdict:</strong> You chose survival. 62% of physicalist philosophers agree with you: because information and psychological continuity are identical, you are the Mars duplicate. But consider Scenario 2 below: What happens when the original Earth body is never vaporized?';
          el.style.borderLeftColor = '#10b981';
        } else {
          el.innerHTML = '<strong>Subjective Continuity Verdict:</strong> You chose death. 74% of laypeople agree: from your first-person point of view, your stream of consciousness terminated forever in New York. The duplicate on Mars is a distinct person who merely suffers from the delusion that they are you.';
          el.style.borderLeftColor = '#ef4444';
        }
      }
    </script>
  `;

  writeFileSync(join(utilDir, 'teleporter-paradox.html'), renderPage({
    title: 'The Teletransporter Paradox: Does Fast Travel Kill You? | Digital Tools Shed',
    metaDesc: 'Explore Derek Parfit\'s Teletransporter Paradox. Does atomic duplication preserve personal identity, or is the Star Trek transporter a suicide booth?',
    canonical: `${DOMAIN}/util/teleporter-paradox`,
    bodyContent: teleporterHtml,
    currentPath: '/util/teleporter-paradox'
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
    </script>
  `;

  writeFileSync(join(utilDir, 'experience-machine.html'), renderPage({
    title: 'The Experience Machine: Truth vs. Synthetic Bliss | Digital Tools Shed',
    metaDesc: 'Would you plug into Nozick\'s Experience Machine for a lifetime of simulated bliss? Explore the philosophical audit of hedonism, truth, and virtual reality.',
    canonical: `${DOMAIN}/util/experience-machine`,
    bodyContent: nozickHtml,
    currentPath: '/util/experience-machine'
  }));

  console.log('  ✓ Built Existential Suite (100 Existential Questions Hub, Teleporter Paradox, Experience Machine)');
}
