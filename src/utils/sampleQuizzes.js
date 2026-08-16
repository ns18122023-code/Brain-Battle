export const INITIAL_QUIZZES = [
  {
    id: 'quiz-tech-mastery',
    title: '💻 Ultimate Tech, Code & AI Master Challenge',
    description: '20-question deep dive into modern software engineering, web tech, cloud architecture, cybersecurity, and artificial intelligence.',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    questions: [
      {
        id: 'tech_q1',
        type: 'mcq',
        question: 'Which fundamental data structure operates strictly on a LIFO (Last In, First Out) principle?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'Stack', isCorrect: true },
          { text: 'Queue', isCorrect: false },
          { text: 'Linked List', isCorrect: false },
          { text: 'Binary Heap', isCorrect: false }
        ]
      },
      {
        id: 'tech_q2',
        type: 'mcq',
        question: 'What does the humorous HTTP status code 418 traditionally signify according to RFC 2324?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: "I'm a teapot", isCorrect: true },
          { text: 'Bad Gateway', isCorrect: false },
          { text: 'Payment Required', isCorrect: false },
          { text: 'Gateway Timeout', isCorrect: false }
        ]
      },
      {
        id: 'tech_q3',
        type: 'true_false',
        question: 'In JavaScript, the expression typeof null evaluates to the string "object".',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'tech_q4',
        type: 'mcq',
        question: 'Which consensus mechanism does the original Bitcoin blockchain use to validate transactions?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'Proof of Work (PoW)', isCorrect: true },
          { text: 'Proof of Stake (PoS)', isCorrect: false },
          { text: 'Delegated Byzantine Fault Tolerance', isCorrect: false },
          { text: 'Proof of Authority (PoA)', isCorrect: false }
        ]
      },
      {
        id: 'tech_q5',
        type: 'mcq',
        question: 'In CSS Flexbox layout, which property is used to align flex items along the cross axis?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'align-items', isCorrect: true },
          { text: 'justify-content', isCorrect: false },
          { text: 'flex-direction', isCorrect: false },
          { text: 'align-content', isCorrect: false }
        ]
      },
      {
        id: 'tech_q6',
        type: 'true_false',
        question: 'Git was originally created in 2005 by Linus Torvalds to maintain the Linux kernel codebase.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'tech_q7',
        type: 'mcq',
        question: 'Which React hook is explicitly designed to handle side effects like API requests, subscriptions, and DOM updates?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'useEffect', isCorrect: true },
          { text: 'useMemo', isCorrect: false },
          { text: 'useCallback', isCorrect: false },
          { text: 'useState', isCorrect: false }
        ]
      },
      {
        id: 'tech_q8',
        type: 'mcq',
        question: 'Which technology company developed and initially open-sourced the TypeScript programming language in 2012?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Microsoft', isCorrect: true },
          { text: 'Google', isCorrect: false },
          { text: 'Meta (Facebook)', isCorrect: false },
          { text: 'Apple', isCorrect: false }
        ]
      },
      {
        id: 'tech_q9',
        type: 'true_false',
        question: 'Python is a statically typed and ahead-of-time (AOT) compiled programming language.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'tech_q10',
        type: 'mcq',
        question: 'In database transaction management, what does the ACID acronym stand for?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'Atomicity, Consistency, Isolation, Durability', isCorrect: true },
          { text: 'Authenticity, Concurrency, Integrity, Durability', isCorrect: false },
          { text: 'Asynchrony, Consistency, Isolation, Distribution', isCorrect: false },
          { text: 'Allocation, Concurrency, Indexing, Decoupling', isCorrect: false }
        ]
      },
      {
        id: 'tech_q11',
        type: 'mcq',
        question: 'Which standard network port is universally assigned for secure encrypted HTTPS web traffic?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Port 443', isCorrect: true },
          { text: 'Port 80', isCorrect: false },
          { text: 'Port 8080', isCorrect: false },
          { text: 'Port 22', isCorrect: false }
        ]
      },
      {
        id: 'tech_q12',
        type: 'true_false',
        question: 'In Docker containerization, a running container is an active, isolated execution instance of a Docker image.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'tech_q13',
        type: 'mcq',
        question: 'Which neural network architecture introduced the Self-Attention mechanism in the 2017 paper "Attention Is All You Need"?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'Transformer', isCorrect: true },
          { text: 'Recurrent Neural Network (RNN)', isCorrect: false },
          { text: 'Convolutional Neural Network (CNN)', isCorrect: false },
          { text: 'Multilayer Perceptron (MLP)', isCorrect: false }
        ]
      },
      {
        id: 'tech_q14',
        type: 'mcq',
        question: 'What is the average time complexity of searching for an element in a balanced Binary Search Tree (BST)?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'O(log n)', isCorrect: true },
          { text: 'O(n)', isCorrect: false },
          { text: 'O(1)', isCorrect: false },
          { text: 'O(n log n)', isCorrect: false }
        ]
      },
      {
        id: 'tech_q15',
        type: 'true_false',
        question: 'RESTful API architecture strictly mandates that all response payloads must be encoded in XML format.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'tech_q16',
        type: 'mcq',
        question: 'In Unix and Linux systems, which command displays filesystem disk space usage in human-readable format?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'df -h', isCorrect: true },
          { text: 'du -sh', isCorrect: false },
          { text: 'top', isCorrect: false },
          { text: 'free -m', isCorrect: false }
        ]
      },
      {
        id: 'tech_q17',
        type: 'mcq',
        question: 'Which company originally created Kubernetes before donating the project to the Cloud Native Computing Foundation (CNCF)?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Google', isCorrect: true },
          { text: 'Red Hat', isCorrect: false },
          { text: 'VMware', isCorrect: false },
          { text: 'Amazon Web Services', isCorrect: false }
        ]
      },
      {
        id: 'tech_q18',
        type: 'true_false',
        question: 'WebAssembly (Wasm) enables compiled languages like C++, Rust, and Go to execute inside modern web browsers at near-native speeds.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'tech_q19',
        type: 'mcq',
        question: 'What is the primary role of a Reverse Proxy (such as Nginx or HAProxy) in modern web infrastructure?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'Intercepting and routing incoming client requests to backend servers', isCorrect: true },
          { text: 'Compiling frontend JavaScript source code into machine binaries', isCorrect: false },
          { text: 'Creating database schemas and relational foreign keys automatically', isCorrect: false },
          { text: 'Storing SSL private keys directly inside client web browsers', isCorrect: false }
        ]
      },
      {
        id: 'tech_q20',
        type: 'mcq',
        question: 'Which asymmetric cryptographic algorithm is founded upon the computational difficulty of factoring the product of two large prime numbers?',
        timeLimit: 20,
        points: 1000,
        options: [
          { text: 'RSA', isCorrect: true },
          { text: 'AES-256', isCorrect: false },
          { text: 'SHA-256', isCorrect: false },
          { text: 'Blowfish', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz-general-knowledge-world',
    title: '🌍 Global Explorer: World Trivia & Wonders',
    description: '20 thrilling questions spanning world capitals, historical milestones, geography, famous monuments, and cultural wonders.',
    category: 'General Knowledge',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    questions: [
      {
        id: 'gk_q1',
        type: 'mcq',
        question: 'What is the official national capital city of Australia?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Canberra', isCorrect: true },
          { text: 'Sydney', isCorrect: false },
          { text: 'Melbourne', isCorrect: false },
          { text: 'Brisbane', isCorrect: false }
        ]
      },
      {
        id: 'gk_q2',
        type: 'mcq',
        question: 'Which country in the world contains the greatest number of natural lakes?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Canada', isCorrect: true },
          { text: 'Russia', isCorrect: false },
          { text: 'Finland', isCorrect: false },
          { text: 'United States', isCorrect: false }
        ]
      },
      {
        id: 'gk_q3',
        type: 'true_false',
        question: 'Vatican City is the smallest independent state in the world by both land area and total population.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'gk_q4',
        type: 'mcq',
        question: 'In which historic year did the Apollo 11 mission successfully land the first humans on the Moon?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: '1969', isCorrect: true },
          { text: '1965', isCorrect: false },
          { text: '1972', isCorrect: false },
          { text: '1959', isCorrect: false }
        ]
      },
      {
        id: 'gk_q5',
        type: 'mcq',
        question: 'What is widely recognized as the longest river in the world by total measured length?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Nile River', isCorrect: true },
          { text: 'Amazon River', isCorrect: false },
          { text: 'Yangtze River', isCorrect: false },
          { text: 'Mississippi River', isCorrect: false }
        ]
      },
      {
        id: 'gk_q6',
        type: 'true_false',
        question: 'The Great Pyramid of Giza is the oldest of the Seven Wonders of the Ancient World and the only one still largely intact.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'gk_q7',
        type: 'mcq',
        question: 'Which desert is the largest hot subtropical desert on planet Earth?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Sahara Desert', isCorrect: true },
          { text: 'Arabian Desert', isCorrect: false },
          { text: 'Gobi Desert', isCorrect: false },
          { text: 'Kalahari Desert', isCorrect: false }
        ]
      },
      {
        id: 'gk_q8',
        type: 'mcq',
        question: 'Which famous Dutch master painted the celebrated Golden Age portrait "Girl with a Pearl Earring"?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Johannes Vermeer', isCorrect: true },
          { text: 'Rembrandt van Rijn', isCorrect: false },
          { text: 'Vincent van Gogh', isCorrect: false },
          { text: 'Frans Hals', isCorrect: false }
        ]
      },
      {
        id: 'gk_q9',
        type: 'true_false',
        question: 'Mount Kilimanjaro in Tanzania is the tallest free-standing mountain above sea level on Earth.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'gk_q10',
        type: 'mcq',
        question: 'What is the official legal tender currency of Japan?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Japanese Yen (¥)', isCorrect: true },
          { text: 'South Korean Won (₩)', isCorrect: false },
          { text: 'Chinese Yuan (¥)', isCorrect: false },
          { text: 'Malaysian Ringgit (RM)', isCorrect: false }
        ]
      },
      {
        id: 'gk_q11',
        type: 'mcq',
        question: 'Which strategic strait connects the Atlantic Ocean directly to the Mediterranean Sea?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Strait of Gibraltar', isCorrect: true },
          { text: 'Bosphorus Strait', isCorrect: false },
          { text: 'Strait of Hormuz', isCorrect: false },
          { text: 'Strait of Malacca', isCorrect: false }
        ]
      },
      {
        id: 'gk_q12',
        type: 'true_false',
        question: 'During his youth in ancient Macedonia, Alexander the Great was personally tutored by the philosopher Aristotle.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'gk_q13',
        type: 'mcq',
        question: 'Which country gifted the iconic Statue of Liberty to the United States in the late 19th century?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'France', isCorrect: true },
          { text: 'United Kingdom', isCorrect: false },
          { text: 'Spain', isCorrect: false },
          { text: 'Italy', isCorrect: false }
        ]
      },
      {
        id: 'gk_q14',
        type: 'mcq',
        question: 'What is the largest island in the world that is not classified as an independent continent?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Greenland', isCorrect: true },
          { text: 'New Guinea', isCorrect: false },
          { text: 'Borneo', isCorrect: false },
          { text: 'Madagascar', isCorrect: false }
        ]
      },
      {
        id: 'gk_q15',
        type: 'true_false',
        question: 'Africa is the only continent on Earth that spans across all four geographic hemispheres (Northern, Southern, Eastern, and Western).',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'gk_q16',
        type: 'mcq',
        question: 'Which city hosted the inaugural Olympic Games of the modern era in the year 1896?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Athens, Greece', isCorrect: true },
          { text: 'Paris, France', isCorrect: false },
          { text: 'London, United Kingdom', isCorrect: false },
          { text: 'Rome, Italy', isCorrect: false }
        ]
      },
      {
        id: 'gk_q17',
        type: 'mcq',
        question: 'What is the deepest known oceanic trench located on planet Earth?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Mariana Trench', isCorrect: true },
          { text: 'Puerto Rico Trench', isCorrect: false },
          { text: 'Java Trench', isCorrect: false },
          { text: 'Tonga Trench', isCorrect: false }
        ]
      },
      {
        id: 'gk_q18',
        type: 'true_false',
        question: 'The Panama Canal directly links the Pacific Ocean with the Indian Ocean.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'gk_q19',
        type: 'mcq',
        question: 'Which ancient pre-Columbian civilization constructed the stunning mountain citadel of Machu Picchu in Peru?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Inca Empire', isCorrect: true },
          { text: 'Maya Civilization', isCorrect: false },
          { text: 'Aztec Empire', isCorrect: false },
          { text: 'Olmec Civilization', isCorrect: false }
        ]
      },
      {
        id: 'gk_q20',
        type: 'mcq',
        question: 'Across how many contiguous standard time zones does the Russian Federation extend?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: '11 Time Zones', isCorrect: true },
          { text: '7 Time Zones', isCorrect: false },
          { text: '9 Time Zones', isCorrect: false },
          { text: '14 Time Zones', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz-science-cosmos',
    title: '🔬 Frontiers of Science: Cosmos, Quantum & Life',
    description: '20 fascinating questions traversing astrophysics, molecular biology, organic chemistry, and fundamental physics.',
    category: 'Science',
    coverImage: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop',
    questions: [
      {
        id: 'sci_q1',
        type: 'mcq',
        question: 'What is the most abundant chemical element in the observable universe?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Hydrogen', isCorrect: true },
          { text: 'Helium', isCorrect: false },
          { text: 'Oxygen', isCorrect: false },
          { text: 'Carbon', isCorrect: false }
        ]
      },
      {
        id: 'sci_q2',
        type: 'mcq',
        question: 'What is the approximate speed of light through a vacuum in kilometers per second?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: '300,000 km/s', isCorrect: true },
          { text: '150,000 km/s', isCorrect: false },
          { text: '450,000 km/s', isCorrect: false },
          { text: '1,000,000 km/s', isCorrect: false }
        ]
      },
      {
        id: 'sci_q3',
        type: 'true_false',
        question: 'Mitochondria are often called the powerhouses of eukaryotic cells because they produce ATP energy.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'sci_q4',
        type: 'mcq',
        question: 'Which fundamental subatomic particle carries a negative electric charge?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Electron', isCorrect: true },
          { text: 'Proton', isCorrect: false },
          { text: 'Neutron', isCorrect: false },
          { text: 'Positron', isCorrect: false }
        ]
      },
      {
        id: 'sci_q5',
        type: 'mcq',
        question: 'What is the exact pH value of pure neutral water at standard room temperature (25°C)?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: '7.0', isCorrect: true },
          { text: '5.5', isCorrect: false },
          { text: '8.0', isCorrect: false },
          { text: '0.0', isCorrect: false }
        ]
      },
      {
        id: 'sci_q6',
        type: 'true_false',
        question: 'Sound mechanical acoustic waves can propagate through a complete vacuum in outer space.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'sci_q7',
        type: 'mcq',
        question: 'Which gas comprises approximately 78% of the dry volume of Earth’s atmosphere?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Nitrogen', isCorrect: true },
          { text: 'Oxygen', isCorrect: false },
          { text: 'Carbon Dioxide', isCorrect: false },
          { text: 'Argon', isCorrect: false }
        ]
      },
      {
        id: 'sci_q8',
        type: 'mcq',
        question: 'What is the standard chemical formula for common table salt?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'NaCl', isCorrect: true },
          { text: 'KCl', isCorrect: false },
          { text: 'Na2SO4', isCorrect: false },
          { text: 'CaCO3', isCorrect: false }
        ]
      },
      {
        id: 'sci_q9',
        type: 'true_false',
        question: 'DNA molecules are constructed of four canonical bases: Adenine, Thymine, Cytosine, and Guanine.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'sci_q10',
        type: 'mcq',
        question: 'Which planet in our solar system features the most prominent and extensive planetary ring system?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Saturn', isCorrect: true },
          { text: 'Jupiter', isCorrect: false },
          { text: 'Uranus', isCorrect: false },
          { text: 'Neptune', isCorrect: false }
        ]
      },
      {
        id: 'sci_q11',
        type: 'mcq',
        question: 'Which polymath formulated the Three Laws of Motion and the Law of Universal Gravitation in 1687?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Sir Isaac Newton', isCorrect: true },
          { text: 'Albert Einstein', isCorrect: false },
          { text: 'Galileo Galilei', isCorrect: false },
          { text: 'Johannes Kepler', isCorrect: false }
        ]
      },
      {
        id: 'sci_q12',
        type: 'true_false',
        question: 'Light displays both wave-like characteristics and particle-like characteristics (wave-particle duality).',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'sci_q13',
        type: 'mcq',
        question: 'Which specialized type of cell division produces four genetically distinct haploid gametes (sperm and egg cells)?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Meiosis', isCorrect: true },
          { text: 'Mitosis', isCorrect: false },
          { text: 'Binary Fission', isCorrect: false },
          { text: 'Budding', isCorrect: false }
        ]
      },
      {
        id: 'sci_q14',
        type: 'true_false',
        question: 'Diamond and graphite are both natural allotropic crystalline forms composed purely of elemental carbon.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'sci_q15',
        type: 'mcq',
        question: 'What boundary around a black hole represents the threshold beyond which nothing, not even light, can escape?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Event Horizon', isCorrect: true },
          { text: 'Photon Sphere', isCorrect: false },
          { text: 'Accretion Disk', isCorrect: false },
          { text: 'Singularity Center', isCorrect: false }
        ]
      },
      {
        id: 'sci_q16',
        type: 'mcq',
        question: 'Which human organ consumes approximately 20% of the body’s total oxygen and glucose supply despite being only 2% of body mass?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Brain', isCorrect: true },
          { text: 'Liver', isCorrect: false },
          { text: 'Heart', isCorrect: false },
          { text: 'Kidneys', isCorrect: false }
        ]
      },
      {
        id: 'sci_q17',
        type: 'true_false',
        question: 'Absolute zero temperature (0 Kelvin) corresponds to exactly -273.15 degrees on the Celsius scale.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'sci_q18',
        type: 'mcq',
        question: 'What core nuclear fusion process predominantly fuels our Sun, fusing hydrogen nuclei into what element?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Helium', isCorrect: true },
          { text: 'Carbon', isCorrect: false },
          { text: 'Iron', isCorrect: false },
          { text: 'Oxygen', isCorrect: false }
        ]
      },
      {
        id: 'sci_q19',
        type: 'mcq',
        question: 'What is the geological name for the massive supercontinent that assembled 335 million years ago on early Earth?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Pangaea', isCorrect: true },
          { text: 'Gondwanaland', isCorrect: false },
          { text: 'Laurasia', isCorrect: false },
          { text: 'Rodinia', isCorrect: false }
        ]
      },
      {
        id: 'sci_q20',
        type: 'mcq',
        question: 'Which human blood group type is universally regarded as the universal red blood cell donor in emergency medicine?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'O Negative (O-)', isCorrect: true },
          { text: 'AB Positive (AB+)', isCorrect: false },
          { text: 'A Positive (A+)', isCorrect: false },
          { text: 'O Positive (O+)', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz-pop-culture-legends',
    title: '🍿 Pop Culture Icons, Cinema & Gaming Trivia',
    description: '20 high-energy questions covering legendary movie franchises, gaming lore, iconic music hits, and pop entertainment history.',
    category: 'Pop Culture',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    questions: [
      {
        id: 'pop_q1',
        type: 'mcq',
        question: 'In the Marvel Cinematic Universe (MCU), what fictional rare Wakandan metal makes up Captain America’s shield?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Vibranium', isCorrect: true },
          { text: 'Adamantium', isCorrect: false },
          { text: 'Beskar', isCorrect: false },
          { text: 'Kryptonite', isCorrect: false }
        ]
      },
      {
        id: 'pop_q2',
        type: 'mcq',
        question: 'Which legendary 1982 album by Michael Jackson holds the world record as the best-selling album of all time?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Thriller', isCorrect: true },
          { text: 'Bad', isCorrect: false },
          { text: 'Off the Wall', isCorrect: false },
          { text: 'Dangerous', isCorrect: false }
        ]
      },
      {
        id: 'pop_q3',
        type: 'true_false',
        question: 'In the 1999 sci-fi classic "The Matrix", taking the Blue Pill causes Neo to wake up to reality in the real world.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'pop_q4',
        type: 'mcq',
        question: 'Which blockbuster video game franchise stars Master Chief Petty Officer John-117 and the AI companion Cortana?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Halo', isCorrect: true },
          { text: 'Gears of War', isCorrect: false },
          { text: 'Destiny', isCorrect: false },
          { text: 'Mass Effect', isCorrect: false }
        ]
      },
      {
        id: 'pop_q5',
        type: 'mcq',
        question: 'What is the primary continent where the epic struggles in HBO’s "Game of Thrones" predominantly occur?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Westeros', isCorrect: true },
          { text: 'Essos', isCorrect: false },
          { text: 'Tamriel', isCorrect: false },
          { text: 'Middle-earth', isCorrect: false }
        ]
      },
      {
        id: 'pop_q6',
        type: 'true_false',
        question: 'Nintendo’s mascot Mario was originally named "Jumpman" in the 1981 arcade game Donkey Kong.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'pop_q7',
        type: 'mcq',
        question: 'Who directed the visionary Oscar-winning movies "Inception", "Interstellar", "The Dark Knight", and "Oppenheimer"?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Christopher Nolan', isCorrect: true },
          { text: 'Denis Villeneuve', isCorrect: false },
          { text: 'Steven Spielberg', isCorrect: false },
          { text: 'James Cameron', isCorrect: false }
        ]
      },
      {
        id: 'pop_q8',
        type: 'mcq',
        question: 'In the Harry Potter universe, what species of noble magical creature is Hagrid’s beloved companion Buckbeak?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Hippogriff', isCorrect: true },
          { text: 'Thestral', isCorrect: false },
          { text: 'Griffin', isCorrect: false },
          { text: 'Basilisk', isCorrect: false }
        ]
      },
      {
        id: 'pop_q9',
        type: 'true_false',
        question: 'James Cameron’s 2009 cinematic spectacle "Avatar" remains the highest-grossing box office film in world history.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'pop_q10',
        type: 'mcq',
        question: 'Which legendary British rock band released the timeless 1973 album "The Dark Side of the Moon"?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Pink Floyd', isCorrect: true },
          { text: 'Led Zeppelin', isCorrect: false },
          { text: 'The Beatles', isCorrect: false },
          { text: 'The Rolling Stones', isCorrect: false }
        ]
      },
      {
        id: 'pop_q11',
        type: 'mcq',
        question: 'In the Star Wars universe, what is the name of Han Solo and Chewbacca’s iconic modified Corellian freighter?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Millennium Falcon', isCorrect: true },
          { text: 'Razor Crest', isCorrect: false },
          { text: 'Star Destroyer', isCorrect: false },
          { text: 'Slave I', isCorrect: false }
        ]
      },
      {
        id: 'pop_q12',
        type: 'true_false',
        question: 'Pac-Man creator Toru Iwatani stated that the character’s shape was inspired by a pizza missing a single slice.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'pop_q13',
        type: 'mcq',
        question: 'Which global streaming giant created the smash-hit 80s-inspired sci-fi supernatural series "Stranger Things"?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Netflix', isCorrect: true },
          { text: 'HBO Max', isCorrect: false },
          { text: 'Disney+', isCorrect: false },
          { text: 'Amazon Prime Video', isCorrect: false }
        ]
      },
      {
        id: 'pop_q14',
        type: 'mcq',
        question: 'In Nintendo’s "The Legend of Zelda" video game series, what is the name of the brave green-clad hero?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Link', isCorrect: true },
          { text: 'Zelda', isCorrect: false },
          { text: 'Ganon', isCorrect: false },
          { text: 'Sheik', isCorrect: false }
        ]
      },
      {
        id: 'pop_q15',
        type: 'true_false',
        question: 'Marvel Comics icon Stan Lee made his very first on-screen Marvel movie cameo in 2008’s "Iron Man".',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: false },
          { text: 'False', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'pop_q16',
        type: 'mcq',
        question: 'Which iconic rock band recorded the global anthems "Bohemian Rhapsody", "Don\'t Stop Me Now", and "We Will Rock You"?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Queen', isCorrect: true },
          { text: 'The Who', isCorrect: false },
          { text: 'Aerosmith', isCorrect: false },
          { text: 'Deep Purple', isCorrect: false }
        ]
      },
      {
        id: 'pop_q17',
        type: 'mcq',
        question: 'Which animated Disney/Pixar blockbuster sequel became the highest-grossing film of 2024 worldwide?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Inside Out 2', isCorrect: true },
          { text: 'Despicable Me 4', isCorrect: false },
          { text: 'Kung Fu Panda 4', isCorrect: false },
          { text: 'Moana 2', isCorrect: false }
        ]
      },
      {
        id: 'pop_q18',
        type: 'true_false',
        question: 'In the Pokémon franchise, Pikachu evolves into Raichu when exposed to an elemental Thunder Stone.',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'True', isCorrect: true },
          { text: 'False', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      },
      {
        id: 'pop_q19',
        type: 'mcq',
        question: 'Which acclaimed Hollywood actor stars as the unstoppable legendary assassin John Wick across the action franchise?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Keanu Reeves', isCorrect: true },
          { text: 'Liam Neeson', isCorrect: false },
          { text: 'Tom Cruise', isCorrect: false },
          { text: 'Jason Statham', isCorrect: false }
        ]
      },
      {
        id: 'pop_q20',
        type: 'mcq',
        question: 'Which multiplayer battle royale title developed by Epic Games became a massive cultural pop phenomenon after its 2017 release?',
        timeLimit: 15,
        points: 1000,
        options: [
          { text: 'Fortnite', isCorrect: true },
          { text: 'PUBG: Battlegrounds', isCorrect: false },
          { text: 'Apex Legends', isCorrect: false },
          { text: 'Call of Duty: Warzone', isCorrect: false }
        ]
      }
    ]
  }
];
