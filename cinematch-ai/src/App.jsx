import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// ─── MOVIE DATASET (250 items) ───
const MOVIES = [
  { id: 1, title: "The Shawshank Redemption", year: 1994, genre: ["Drama"], director: "Frank Darabont", rating: 9.3, desc: "A banker convicted of uxoricide forms a transformative friendship with a fellow prisoner as they find solace and eventual redemption through acts of common decency.", tags: ["prison", "friendship", "hope", "escape"], mood: "inspiring" },
  { id: 2, title: "The Godfather", year: 1972, genre: ["Crime", "Drama"], director: "Francis Ford Coppola", rating: 9.2, desc: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.", tags: ["mafia", "family", "power", "loyalty"], mood: "intense" },
  { id: 3, title: "The Dark Knight", year: 2008, genre: ["Action", "Crime", "Drama"], director: "Christopher Nolan", rating: 9.0, desc: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.", tags: ["superhero", "villain", "chaos", "justice"], mood: "thrilling" },
  { id: 4, title: "Pulp Fiction", year: 1994, genre: ["Crime", "Drama"], director: "Quentin Tarantino", rating: 8.9, desc: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", tags: ["nonlinear", "dialogue", "crime", "dark-humor"], mood: "edgy" },
  { id: 5, title: "Schindler's List", year: 1993, genre: ["Biography", "Drama", "History"], director: "Steven Spielberg", rating: 9.0, desc: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.", tags: ["holocaust", "heroism", "war", "humanity"], mood: "emotional" },
  { id: 6, title: "The Lord of the Rings: The Return of the King", year: 2003, genre: ["Action", "Adventure", "Drama"], director: "Peter Jackson", rating: 9.0, desc: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom.", tags: ["fantasy", "quest", "epic", "friendship"], mood: "epic" },
  { id: 7, title: "Fight Club", year: 1999, genre: ["Drama"], director: "David Fincher", rating: 8.8, desc: "An insomniac office worker and a soap salesman build a global organization to help vent male aggression.", tags: ["identity", "rebellion", "twist", "consumerism"], mood: "edgy" },
  { id: 8, title: "Forrest Gump", year: 1994, genre: ["Drama", "Romance"], director: "Robert Zemeckis", rating: 8.8, desc: "The presidencies of Kennedy and Johnson through Vietnam and beyond through the eyes of an Alabama man with an IQ of 75.", tags: ["history", "innocence", "love", "journey"], mood: "heartwarming" },
  { id: 9, title: "Inception", year: 2010, genre: ["Action", "Adventure", "Sci-Fi"], director: "Christopher Nolan", rating: 8.8, desc: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.", tags: ["dreams", "heist", "mind-bending", "layers"], mood: "thrilling" },
  { id: 10, title: "The Matrix", year: 1999, genre: ["Action", "Sci-Fi"], director: "Lana Wachowski", rating: 8.7, desc: "When a hacker discovers that reality is a simulation, he joins a rebellion against machine overlords.", tags: ["simulation", "chosen-one", "philosophy", "cyberpunk"], mood: "thrilling" },
  { id: 11, title: "Goodfellas", year: 1990, genre: ["Biography", "Crime", "Drama"], director: "Martin Scorsese", rating: 8.7, desc: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen and his mob partners.", tags: ["mafia", "rise-and-fall", "crime", "loyalty"], mood: "intense" },
  { id: 12, title: "Interstellar", year: 2014, genre: ["Adventure", "Drama", "Sci-Fi"], director: "Christopher Nolan", rating: 8.7, desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", tags: ["space", "time", "love", "science"], mood: "epic" },
  { id: 13, title: "City of God", year: 2002, genre: ["Crime", "Drama"], director: "Fernando Meirelles", rating: 8.6, desc: "In the slums of Rio, two kids paths diverge as one struggles to become a photographer and the other a kingpin.", tags: ["poverty", "violence", "coming-of-age", "brazil"], mood: "intense" },
  { id: 14, title: "Spirited Away", year: 2001, genre: ["Animation", "Adventure", "Family"], director: "Hayao Miyazaki", rating: 8.6, desc: "During her family's move, a young girl enters a world ruled by gods, witches, and spirits where humans are changed into beasts.", tags: ["anime", "magical", "coming-of-age", "japanese"], mood: "whimsical" },
  { id: 15, title: "Saving Private Ryan", year: 1998, genre: ["Drama", "War"], director: "Steven Spielberg", rating: 8.6, desc: "Following the Normandy Landings, a group of soldiers goes behind enemy lines to retrieve a paratrooper whose brothers have been killed.", tags: ["war", "sacrifice", "brotherhood", "ww2"], mood: "intense" },
  { id: 16, title: "The Silence of the Lambs", year: 1991, genre: ["Crime", "Drama", "Thriller"], director: "Jonathan Demme", rating: 8.6, desc: "A young FBI cadet must receive the help of an incarcerated manipulative cannibal to catch another serial killer.", tags: ["serial-killer", "psychological", "cat-and-mouse", "thriller"], mood: "suspenseful" },
  { id: 17, title: "Se7en", year: 1995, genre: ["Crime", "Drama", "Mystery"], director: "David Fincher", rating: 8.6, desc: "Two detectives hunt a serial killer who uses the seven deadly sins as his motives.", tags: ["serial-killer", "dark", "mystery", "twist"], mood: "dark" },
  { id: 18, title: "The Green Mile", year: 1999, genre: ["Crime", "Drama", "Fantasy"], director: "Frank Darabont", rating: 8.6, desc: "The lives of guards on Death Row are affected by one of their charges: a man accused of child murder who has a mysterious gift.", tags: ["prison", "supernatural", "justice", "emotion"], mood: "emotional" },
  { id: 19, title: "Parasite", year: 2019, genre: ["Comedy", "Drama", "Thriller"], director: "Bong Joon-ho", rating: 8.5, desc: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", tags: ["class", "twist", "social-commentary", "korean"], mood: "suspenseful" },
  { id: 20, title: "Gladiator", year: 2000, genre: ["Action", "Adventure", "Drama"], director: "Ridley Scott", rating: 8.5, desc: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", tags: ["revenge", "roman", "arena", "honor"], mood: "epic" },
  { id: 21, title: "The Departed", year: 2006, genre: ["Crime", "Drama", "Thriller"], director: "Martin Scorsese", rating: 8.5, desc: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.", tags: ["undercover", "identity", "boston", "betrayal"], mood: "intense" },
  { id: 22, title: "Whiplash", year: 2014, genre: ["Drama", "Music"], director: "Damien Chazelle", rating: 8.5, desc: "A promising young drummer enrolls at a music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.", tags: ["music", "obsession", "mentorship", "perfection"], mood: "intense" },
  { id: 23, title: "The Prestige", year: 2006, genre: ["Drama", "Mystery", "Sci-Fi"], director: "Christopher Nolan", rating: 8.5, desc: "Two rival magicians engage in a bitter battle for supremacy, each trying to outdo the other with increasingly dangerous tricks.", tags: ["magic", "rivalry", "twist", "obsession"], mood: "suspenseful" },
  { id: 24, title: "Django Unchained", year: 2012, genre: ["Drama", "Western"], director: "Quentin Tarantino", rating: 8.5, desc: "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal plantation owner.", tags: ["slavery", "revenge", "western", "dark-humor"], mood: "edgy" },
  { id: 25, title: "The Lion King", year: 1994, genre: ["Animation", "Adventure", "Drama"], director: "Roger Allers", rating: 8.5, desc: "Lion prince Simba flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery.", tags: ["animation", "coming-of-age", "family", "africa"], mood: "heartwarming" },
  { id: 26, title: "Alien", year: 1979, genre: ["Horror", "Sci-Fi"], director: "Ridley Scott", rating: 8.5, desc: "The crew of a commercial spacecraft encounters a deadly lifeform after investigating an unknown transmission.", tags: ["space", "horror", "survival", "creature"], mood: "suspenseful" },
  { id: 27, title: "WALL-E", year: 2008, genre: ["Animation", "Adventure", "Family"], director: "Andrew Stanton", rating: 8.4, desc: "In the distant future a small waste-collecting robot inadvertently embarks on a space journey that decides the fate of mankind.", tags: ["robot", "love", "environment", "animation"], mood: "heartwarming" },
  { id: 28, title: "Memento", year: 2000, genre: ["Mystery", "Thriller"], director: "Christopher Nolan", rating: 8.4, desc: "A man with short-term memory loss attempts to track down the murderer of his wife using notes and tattoos.", tags: ["memory", "nonlinear", "mystery", "identity"], mood: "suspenseful" },
  { id: 29, title: "Eternal Sunshine of the Spotless Mind", year: 2004, genre: ["Drama", "Romance", "Sci-Fi"], director: "Michel Gondry", rating: 8.3, desc: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.", tags: ["memory", "love", "loss", "surreal"], mood: "melancholy" },
  { id: 30, title: "Amélie", year: 2001, genre: ["Comedy", "Romance"], director: "Jean-Pierre Jeunet", rating: 8.3, desc: "A shy waitress decides to change the lives of those around her for the better while struggling with her own isolation.", tags: ["paris", "whimsical", "love", "kindness"], mood: "whimsical" },
  { id: 31, title: "The Truman Show", year: 1998, genre: ["Comedy", "Drama"], director: "Peter Weir", rating: 8.2, desc: "An insurance salesman discovers his whole life is actually a reality TV show.", tags: ["reality", "freedom", "media", "identity"], mood: "thought-provoking" },
  { id: 32, title: "No Country for Old Men", year: 2007, genre: ["Crime", "Drama", "Thriller"], director: "Coen Brothers", rating: 8.2, desc: "Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash.", tags: ["fate", "violence", "cat-and-mouse", "western"], mood: "dark" },
  { id: 33, title: "Blade Runner 2049", year: 2017, genre: ["Action", "Drama", "Mystery"], director: "Denis Villeneuve", rating: 8.0, desc: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.", tags: ["cyberpunk", "identity", "dystopia", "ai"], mood: "melancholy" },
  { id: 34, title: "Mad Max: Fury Road", year: 2015, genre: ["Action", "Adventure", "Sci-Fi"], director: "George Miller", rating: 8.1, desc: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.", tags: ["post-apocalyptic", "chase", "feminist", "action"], mood: "thrilling" },
  { id: 35, title: "The Grand Budapest Hotel", year: 2014, genre: ["Adventure", "Comedy", "Crime"], director: "Wes Anderson", rating: 8.1, desc: "A writer encounters the owner of an aging luxury hotel, who tells him of his early years serving as lobby boy to a legendary concierge.", tags: ["quirky", "visual", "comedy", "europe"], mood: "whimsical" },
  { id: 36, title: "The Shining", year: 1980, genre: ["Drama", "Horror"], director: "Stanley Kubrick", rating: 8.4, desc: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.", tags: ["horror", "isolation", "madness", "supernatural"], mood: "dark" },
  { id: 37, title: "Jurassic Park", year: 1993, genre: ["Action", "Adventure", "Sci-Fi"], director: "Steven Spielberg", rating: 8.2, desc: "A pragmatic paleontologist touring an almost complete theme park is tasked with protecting a couple of kids after dinosaurs break free.", tags: ["dinosaurs", "science", "theme-park", "survival"], mood: "thrilling" },
  { id: 38, title: "Back to the Future", year: 1985, genre: ["Adventure", "Comedy", "Sci-Fi"], director: "Robert Zemeckis", rating: 8.5, desc: "Marty McFly, a typical American teenager of the '80s, accidentally travels back in time to 1955.", tags: ["time-travel", "comedy", "80s", "adventure"], mood: "fun" },
  { id: 39, title: "The Social Network", year: 2010, genre: ["Biography", "Drama"], director: "David Fincher", rating: 7.8, desc: "As Harvard student Mark Zuckerberg creates the social networking site that becomes Facebook, he is sued by two brothers who claim he stole their idea.", tags: ["tech", "ambition", "betrayal", "startup"], mood: "intense" },
  { id: 40, title: "Her", year: 2013, genre: ["Drama", "Romance", "Sci-Fi"], director: "Spike Jonze", rating: 8.0, desc: "In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.", tags: ["ai", "love", "loneliness", "future"], mood: "melancholy" },
  { id: 41, title: "2001: A Space Odyssey", year: 1968, genre: ["Adventure", "Sci-Fi"], director: "Stanley Kubrick", rating: 8.3, desc: "After discovering a mysterious artifact buried beneath the Lunar surface, mankind sets off on a quest to find its origins with the help of intelligent supercomputer HAL 9000.", tags: ["space", "ai", "evolution", "philosophical"], mood: "thought-provoking" },
  { id: 42, title: "Oldboy", year: 2003, genre: ["Action", "Drama", "Mystery"], director: "Park Chan-wook", rating: 8.4, desc: "After being kidnapped and imprisoned for fifteen years, a man is released and sets out to find the reason for his incarceration.", tags: ["revenge", "twist", "korean", "psychological"], mood: "dark" },
  { id: 43, title: "Arrival", year: 2016, genre: ["Drama", "Mystery", "Sci-Fi"], director: "Denis Villeneuve", rating: 7.9, desc: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.", tags: ["aliens", "language", "time", "communication"], mood: "thought-provoking" },
  { id: 44, title: "The Thing", year: 1982, genre: ["Horror", "Mystery", "Sci-Fi"], director: "John Carpenter", rating: 8.2, desc: "A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.", tags: ["alien", "paranoia", "horror", "isolation"], mood: "suspenseful" },
  { id: 45, title: "Taxi Driver", year: 1976, genre: ["Crime", "Drama"], director: "Martin Scorsese", rating: 8.2, desc: "A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels his urge for violent action.", tags: ["isolation", "madness", "new-york", "vigilante"], mood: "dark" },
  { id: 46, title: "Everything Everywhere All at Once", year: 2022, genre: ["Action", "Adventure", "Comedy"], director: "Daniel Kwan", rating: 7.8, desc: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.", tags: ["multiverse", "family", "absurd", "existential"], mood: "emotional" },
  { id: 47, title: "Moonlight", year: 2016, genre: ["Drama"], director: "Barry Jenkins", rating: 7.4, desc: "A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and bursting adulthood.", tags: ["identity", "coming-of-age", "poverty", "love"], mood: "emotional" },
  { id: 48, title: "Get Out", year: 2017, genre: ["Horror", "Mystery", "Thriller"], director: "Jordan Peele", rating: 7.7, desc: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.", tags: ["race", "horror", "social-commentary", "twist"], mood: "suspenseful" },
  { id: 49, title: "La La Land", year: 2016, genre: ["Comedy", "Drama", "Music"], director: "Damien Chazelle", rating: 8.0, desc: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.", tags: ["music", "love", "dreams", "los-angeles"], mood: "bittersweet" },
  { id: 50, title: "The Revenant", year: 2015, genre: ["Action", "Adventure", "Drama"], director: "Alejandro Iñárritu", rating: 8.0, desc: "A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear and left for dead.", tags: ["survival", "revenge", "nature", "frontier"], mood: "intense" },
  { id: 51, title: "A Clockwork Orange", year: 1971, genre: ["Crime", "Drama", "Sci-Fi"], director: "Stanley Kubrick", rating: 8.3, desc: "In a dystopian future, a charismatic delinquent is jailed and volunteers for an experimental aversion therapy developed by the government.", tags: ["dystopia", "violence", "free-will", "satire"], mood: "dark" },
  { id: 52, title: "Rear Window", year: 1954, genre: ["Mystery", "Thriller"], director: "Alfred Hitchcock", rating: 8.5, desc: "A photographer confined to his apartment due to a broken leg becomes convinced that a neighbor has committed murder.", tags: ["voyeurism", "suspense", "classic", "mystery"], mood: "suspenseful" },
  { id: 53, title: "The Sixth Sense", year: 1999, genre: ["Drama", "Mystery", "Thriller"], director: "M. Night Shyamalan", rating: 8.2, desc: "A boy who communicates with spirits seeks the help of a disheartened child psychologist.", tags: ["supernatural", "twist", "ghost", "child"], mood: "suspenseful" },
  { id: 54, title: "Inside Out", year: 2015, genre: ["Animation", "Adventure", "Comedy"], director: "Pete Docter", rating: 8.1, desc: "After young Riley is uprooted from her life in the Midwest, her emotions conflict on how best to navigate a new city, house, and school.", tags: ["emotions", "animation", "family", "growing-up"], mood: "heartwarming" },
  { id: 55, title: "Jaws", year: 1975, genre: ["Adventure", "Thriller"], director: "Steven Spielberg", rating: 8.1, desc: "A police chief, marine scientist and fisherman try to stop a great white shark that is terrorizing a beach community.", tags: ["shark", "summer", "survival", "suspense"], mood: "thrilling" },
  { id: 56, title: "Pan's Labyrinth", year: 2006, genre: ["Drama", "Fantasy", "War"], director: "Guillermo del Toro", rating: 8.2, desc: "In post-Civil War Spain, a girl is drawn into a fantastical world of mythical creatures and dangerous quests as reality and fantasy intertwine.", tags: ["fantasy", "war", "dark-fairy-tale", "spanish"], mood: "dark" },
  { id: 57, title: "There Will Be Blood", year: 2007, genre: ["Drama"], director: "Paul Thomas Anderson", rating: 8.2, desc: "A misanthropic oil prospector's ruthless quest for wealth leads to conflict with a charismatic preacher in early 20th-century California.", tags: ["ambition", "greed", "religion", "americana"], mood: "intense" },
  { id: 58, title: "Coco", year: 2017, genre: ["Animation", "Adventure", "Comedy"], director: "Lee Unkrich", rating: 8.4, desc: "Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer.", tags: ["music", "family", "mexican", "death", "animation"], mood: "heartwarming" },
  { id: 59, title: "The Usual Suspects", year: 1995, genre: ["Crime", "Drama", "Mystery"], director: "Bryan Singer", rating: 8.5, desc: "A sole survivor tells the twisted events leading up to a horrific gun battle on a boat.", tags: ["twist", "unreliable-narrator", "crime", "mystery"], mood: "suspenseful" },
  { id: 60, title: "Gone Girl", year: 2014, genre: ["Drama", "Mystery", "Thriller"], director: "David Fincher", rating: 8.1, desc: "With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him.", tags: ["marriage", "media", "twist", "psychological"], mood: "dark" },
  { id: 61, title: "Up", year: 2009, genre: ["Animation", "Adventure", "Comedy"], director: "Pete Docter", rating: 8.3, desc: "By tying thousands of balloons to his house, an elderly widower and a young scout set off to fulfill a lifelong dream.", tags: ["adventure", "animation", "grief", "friendship"], mood: "heartwarming" },
  { id: 62, title: "Kill Bill: Vol. 1", year: 2003, genre: ["Action", "Crime", "Drama"], director: "Quentin Tarantino", rating: 8.2, desc: "After awakening from a coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.", tags: ["revenge", "martial-arts", "stylized", "action"], mood: "thrilling" },
  { id: 63, title: "Dune", year: 2021, genre: ["Action", "Adventure", "Drama"], director: "Denis Villeneuve", rating: 8.0, desc: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset, the desert planet Arrakis.", tags: ["sci-fi", "desert", "politics", "epic"], mood: "epic" },
  { id: 64, title: "The Terminator", year: 1984, genre: ["Action", "Sci-Fi"], director: "James Cameron", rating: 8.1, desc: "A human soldier is sent from 2029 to 1984 to stop a cyborg killing machine sent from the same year to kill a woman whose unborn son will lead humanity.", tags: ["time-travel", "robot", "chase", "dystopia"], mood: "thrilling" },
  { id: 65, title: "Groundhog Day", year: 1993, genre: ["Comedy", "Drama", "Fantasy"], director: "Harold Ramis", rating: 8.1, desc: "A self-centered weatherman finds himself reliving the same day over and over again until he learns to become a better person.", tags: ["time-loop", "comedy", "redemption", "romance"], mood: "fun" },
  { id: 66, title: "12 Angry Men", year: 1957, genre: ["Crime", "Drama"], director: "Sidney Lumet", rating: 9.0, desc: "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence.", tags: ["justice", "debate", "classic", "dialogue"], mood: "thought-provoking" },
  { id: 67, title: "Life Is Beautiful", year: 1997, genre: ["Comedy", "Drama", "Romance"], director: "Roberto Benigni", rating: 8.6, desc: "A Jewish Italian waiter uses humor and imagination to shield his young son from the horrors of a Nazi internment camp.", tags: ["holocaust", "comedy", "family", "italian"], mood: "emotional" },
  { id: 68, title: "The Pianist", year: 2002, genre: ["Biography", "Drama", "Music"], director: "Roman Polanski", rating: 8.5, desc: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto during World War II.", tags: ["war", "music", "survival", "holocaust"], mood: "emotional" },
  { id: 69, title: "Toy Story", year: 1995, genre: ["Animation", "Adventure", "Comedy"], director: "John Lasseter", rating: 8.3, desc: "A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy.", tags: ["animation", "friendship", "toys", "pixar"], mood: "fun" },
  { id: 70, title: "Blade Runner", year: 1982, genre: ["Action", "Drama", "Sci-Fi"], director: "Ridley Scott", rating: 8.1, desc: "A blade runner must pursue and terminate four replicants who have escaped to Earth seeking their creator.", tags: ["cyberpunk", "ai", "dystopia", "identity"], mood: "melancholy" },
  { id: 71, title: "Good Will Hunting", year: 1997, genre: ["Drama", "Romance"], director: "Gus Van Sant", rating: 8.3, desc: "Will Hunting, a janitor at MIT has a gift for mathematics but needs help from a psychologist to find direction in his life.", tags: ["genius", "therapy", "boston", "coming-of-age"], mood: "heartwarming" },
  { id: 72, title: "Ratatouille", year: 2007, genre: ["Animation", "Comedy", "Family"], director: "Brad Bird", rating: 8.1, desc: "A rat who can cook makes an unusual alliance with a young kitchen worker at a famous Paris restaurant.", tags: ["cooking", "paris", "animation", "dreams"], mood: "whimsical" },
  { id: 73, title: "The Exorcist", year: 1973, genre: ["Horror"], director: "William Friedkin", rating: 8.1, desc: "When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.", tags: ["possession", "horror", "religion", "classic"], mood: "dark" },
  { id: 74, title: "A Beautiful Mind", year: 2001, genre: ["Biography", "Drama"], director: "Ron Howard", rating: 8.2, desc: "After John Nash accepts secret work in cryptography, his life takes a turn for the nightmarish.", tags: ["genius", "mental-health", "mathematics", "biography"], mood: "inspiring" },
  { id: 75, title: "Joker", year: 2019, genre: ["Crime", "Drama", "Thriller"], director: "Todd Phillips", rating: 8.4, desc: "During the 1980s, a failed comedian is driven insane and turns to a life of crime and chaos in Gotham City.", tags: ["villain-origin", "mental-health", "society", "transformation"], mood: "dark" },
  { id: 76, title: "The Princess Bride", year: 1987, genre: ["Adventure", "Comedy", "Family"], director: "Rob Reiner", rating: 8.0, desc: "A young woman is kidnapped and a farmhand-turned-pirate sets out to rescue her in a fairy tale adventure.", tags: ["fairy-tale", "comedy", "romance", "adventure"], mood: "fun" },
  { id: 77, title: "District 9", year: 2009, genre: ["Action", "Sci-Fi", "Thriller"], director: "Neill Blomkamp", rating: 7.9, desc: "Aliens land in South Africa and are forced to live in slum-like conditions. A government agent becomes exposed to their technology.", tags: ["aliens", "apartheid", "south-africa", "social-commentary"], mood: "intense" },
  { id: 78, title: "The Big Lebowski", year: 1998, genre: ["Comedy", "Crime"], director: "Coen Brothers", rating: 8.1, desc: "Jeff The Dude Lebowski, mistaken for a millionaire of the same name, seeks restitution for his ruined rug.", tags: ["comedy", "absurd", "bowling", "noir"], mood: "fun" },
  { id: 79, title: "Children of Men", year: 2006, genre: ["Action", "Drama", "Sci-Fi"], director: "Alfonso Cuarón", rating: 7.9, desc: "In a chaotic world in which women have become infertile, a former activist reluctantly agrees to help transport a miraculously pregnant woman.", tags: ["dystopia", "hope", "fertility", "refugee"], mood: "intense" },
  { id: 80, title: "Requiem for a Dream", year: 2000, genre: ["Drama"], director: "Darren Aronofsky", rating: 8.3, desc: "The drug-induced utopias of four Coney Island people are shattered when their addictions run deep.", tags: ["addiction", "spiral", "dark", "psychological"], mood: "dark" },
  { id: 81, title: "Hunt for the Wilderpeople", year: 2016, genre: ["Adventure", "Comedy", "Drama"], director: "Taika Waititi", rating: 7.9, desc: "A national manhunt is ordered for a rebellious kid and his foster uncle who go missing in the New Zealand bush.", tags: ["adventure", "comedy", "new-zealand", "coming-of-age"], mood: "fun" },
  { id: 82, title: "The Witch", year: 2015, genre: ["Drama", "Fantasy", "Horror"], director: "Robert Eggers", rating: 6.9, desc: "A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.", tags: ["folk-horror", "puritan", "isolation", "slow-burn"], mood: "dark" },
  { id: 83, title: "Portrait of a Lady on Fire", year: 2019, genre: ["Drama", "Romance"], director: "Céline Sciamma", rating: 7.5, desc: "On an isolated island, a female painter is commissioned to paint the wedding portrait of a young woman.", tags: ["love", "art", "french", "period-piece"], mood: "melancholy" },
  { id: 84, title: "The Lighthouse", year: 2019, genre: ["Drama", "Fantasy", "Horror"], director: "Robert Eggers", rating: 7.4, desc: "Two lighthouse keepers try to maintain their sanity while living on a remote island in the 1890s.", tags: ["madness", "isolation", "mythology", "black-and-white"], mood: "dark" },
  { id: 85, title: "Nightcrawler", year: 2014, genre: ["Crime", "Drama", "Thriller"], director: "Dan Gilroy", rating: 7.9, desc: "A driven young man stumbles upon nighttime crime journalism in Los Angeles, blurring the line between observer and participant.", tags: ["media", "sociopath", "los-angeles", "ambition"], mood: "dark" },
  { id: 86, title: "Dunkirk", year: 2017, genre: ["Action", "Drama", "History"], director: "Christopher Nolan", rating: 7.8, desc: "Allied soldiers from Belgium and France are surrounded by the German army and evacuated during a fierce battle.", tags: ["war", "survival", "ww2", "suspense"], mood: "intense" },
  { id: 87, title: "1917", year: 2019, genre: ["Drama", "War"], director: "Sam Mendes", rating: 8.3, desc: "Two young British privates are given the seemingly impossible mission to deliver a message that will stop 1,600 men from walking into a trap.", tags: ["war", "one-shot", "ww1", "mission"], mood: "intense" },
  { id: 88, title: "Drive", year: 2011, genre: ["Action", "Drama"], director: "Nicolas Winding Refn", rating: 7.8, desc: "A mysterious Hollywood stuntman and getaway driver lands himself in trouble when he helps out his neighbor.", tags: ["neo-noir", "violence", "stylized", "quiet"], mood: "dark" },
  { id: 89, title: "Zodiac", year: 2007, genre: ["Crime", "Drama", "Mystery"], director: "David Fincher", rating: 7.7, desc: "Between 1968 and 1983, a cartoonist becomes obsessed with tracking down the Zodiac killer.", tags: ["serial-killer", "obsession", "journalism", "unsolved"], mood: "suspenseful" },
  { id: 90, title: "Ex Machina", year: 2014, genre: ["Drama", "Mystery", "Sci-Fi"], director: "Alex Garland", rating: 7.7, desc: "A young programmer is selected to participate in a groundbreaking experiment to evaluate the human qualities of a highly advanced humanoid AI.", tags: ["ai", "consciousness", "isolation", "manipulation"], mood: "suspenseful" },
  { id: 91, title: "The Farewell", year: 2019, genre: ["Comedy", "Drama"], director: "Lulu Wang", rating: 7.5, desc: "A Chinese family discovers their grandmother has only a short while left to live and decide to keep her in the dark.", tags: ["family", "chinese", "cultural", "grief"], mood: "emotional" },
  { id: 92, title: "Sicario", year: 2015, genre: ["Action", "Crime", "Drama"], director: "Denis Villeneuve", rating: 7.6, desc: "An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico.", tags: ["cartel", "border", "moral-ambiguity", "thriller"], mood: "intense" },
  { id: 93, title: "The Handmaiden", year: 2016, genre: ["Crime", "Drama", "Romance"], director: "Park Chan-wook", rating: 8.1, desc: "A woman is hired as a handmaiden to a Japanese heiress, but secretly she is involved in a plot to defraud her.", tags: ["twist", "romance", "korean", "con"], mood: "suspenseful" },
  { id: 94, title: "Predator", year: 1987, genre: ["Action", "Adventure", "Horror"], director: "John McTiernan", rating: 7.8, desc: "A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.", tags: ["alien", "jungle", "action", "survival"], mood: "thrilling" },
  { id: 95, title: "Annihilation", year: 2018, genre: ["Adventure", "Drama", "Horror"], director: "Alex Garland", rating: 6.8, desc: "A biologist signs up for a dangerous expedition into a mysterious zone where the laws of nature don't apply.", tags: ["mutation", "mystery", "science", "psychological"], mood: "thought-provoking" },
  { id: 96, title: "Your Name", year: 2016, genre: ["Animation", "Drama", "Fantasy"], director: "Makoto Shinkai", rating: 8.4, desc: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?", tags: ["anime", "body-swap", "love", "japanese"], mood: "emotional" },
  { id: 97, title: "The Incredibles", year: 2004, genre: ["Animation", "Action", "Adventure"], director: "Brad Bird", rating: 8.0, desc: "A family of undercover superheroes tries to live the quiet suburban life, but is forced into action to save the world.", tags: ["superhero", "family", "animation", "action"], mood: "fun" },
  { id: 98, title: "Prisoners", year: 2013, genre: ["Crime", "Drama", "Mystery"], director: "Denis Villeneuve", rating: 8.1, desc: "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads.", tags: ["kidnapping", "moral-ambiguity", "dark", "suspense"], mood: "dark" },
  { id: 99, title: "The Batman", year: 2022, genre: ["Action", "Crime", "Drama"], director: "Matt Reeves", rating: 7.8, desc: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.", tags: ["superhero", "noir", "detective", "dark"], mood: "dark" },
  { id: 100, title: "Hereditary", year: 2018, genre: ["Drama", "Horror", "Mystery"], director: "Ari Aster", rating: 7.3, desc: "A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.", tags: ["horror", "grief", "family", "cult"], mood: "dark" },
  { id: 101, title: "Roma", year: 2018, genre: ["Drama"], director: "Alfonso Cuarón", rating: 7.7, desc: "A year in the life of a middle-class family's maid in Mexico City in the early 1970s.", tags: ["mexico", "class", "memory", "personal"], mood: "melancholy" },
  { id: 102, title: "Midsommar", year: 2019, genre: ["Drama", "Horror", "Mystery"], director: "Ari Aster", rating: 7.1, desc: "A couple travels to Northern Europe to visit a rural hometown's fabled Swedish midsummer festival only to find themselves in a nightmarish pagan ritual.", tags: ["folk-horror", "relationship", "cult", "daylight-horror"], mood: "dark" },
  { id: 103, title: "Knives Out", year: 2019, genre: ["Comedy", "Crime", "Drama"], director: "Rian Johnson", rating: 7.9, desc: "A detective investigates the death of a patriarch of an eccentric, combative family.", tags: ["whodunit", "comedy", "mystery", "ensemble"], mood: "fun" },
  { id: 104, title: "Oppenheimer", year: 2023, genre: ["Biography", "Drama", "History"], director: "Christopher Nolan", rating: 8.3, desc: "The story of theoretical physicist J. Robert Oppenheimer and his role in the development of the atomic bomb.", tags: ["nuclear", "biography", "war", "science"], mood: "intense" },
  { id: 105, title: "Spider-Man: Into the Spider-Verse", year: 2018, genre: ["Animation", "Action", "Adventure"], director: "Bob Persichetti", rating: 8.4, desc: "Teen Miles Morales becomes the Spider-Man of his universe and must cross dimensions to stop a threat to all realities.", tags: ["animation", "superhero", "multiverse", "stylized"], mood: "fun" },
  { id: 106, title: "Alien: Romulus", year: 2024, genre: ["Horror", "Sci-Fi", "Thriller"], director: "Fede Alvarez", rating: 7.2, desc: "Young space colonizers scavenge a derelict station and encounter the most terrifying life form in the universe.", tags: ["space", "horror", "survival", "alien"], mood: "suspenseful" },
  { id: 107, title: "Little Women", year: 2019, genre: ["Drama", "Romance"], director: "Greta Gerwig", rating: 7.8, desc: "Jo March reflects on her life, telling the beloved story of the March sisters – four young women each determined to live life on her own terms.", tags: ["period-piece", "sisterhood", "feminist", "literary"], mood: "heartwarming" },
  { id: 108, title: "Fargo", year: 1996, genre: ["Crime", "Thriller"], director: "Coen Brothers", rating: 8.1, desc: "A car salesman hires two criminals to kidnap his wife, but the plan goes terribly wrong when a pregnant police chief starts investigating.", tags: ["dark-humor", "crime", "midwest", "quirky"], mood: "dark" },
  { id: 109, title: "Once Upon a Time in Hollywood", year: 2019, genre: ["Comedy", "Drama"], director: "Quentin Tarantino", rating: 7.6, desc: "A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age.", tags: ["hollywood", "nostalgia", "60s", "bromance"], mood: "fun" },
  { id: 110, title: "Minority Report", year: 2002, genre: ["Action", "Crime", "Mystery"], director: "Steven Spielberg", rating: 7.6, desc: "In a future where a special police unit can arrest murderers before they commit their crimes, an officer from that unit is accused of future murder.", tags: ["pre-crime", "dystopia", "chase", "sci-fi"], mood: "thrilling" },
  { id: 111, title: "Finding Nemo", year: 2003, genre: ["Animation", "Adventure", "Comedy"], director: "Andrew Stanton", rating: 8.2, desc: "After his son is captured in the Great Barrier Reef, a timid clownfish sets out on a journey to bring him home.", tags: ["ocean", "family", "adventure", "animation"], mood: "heartwarming" },
  { id: 112, title: "Stalker", year: 1979, genre: ["Drama", "Sci-Fi"], director: "Andrei Tarkovsky", rating: 8.2, desc: "A guide leads two men through a mystical area known as the Zone to find a room that grants a person's innermost desire.", tags: ["philosophical", "russian", "art-house", "metaphysical"], mood: "thought-provoking" },
  { id: 113, title: "Heat", year: 1995, genre: ["Action", "Crime", "Drama"], director: "Michael Mann", rating: 8.3, desc: "A group of high-profile professional thieves start to feel the heat from the LAPD when they unknowingly leave a clue.", tags: ["heist", "cat-and-mouse", "los-angeles", "crime"], mood: "intense" },
  { id: 114, title: "Howl's Moving Castle", year: 2004, genre: ["Animation", "Adventure", "Family"], director: "Hayao Miyazaki", rating: 8.2, desc: "When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard.", tags: ["anime", "magical", "war", "love"], mood: "whimsical" },
  { id: 115, title: "American Beauty", year: 1999, genre: ["Drama"], director: "Sam Mendes", rating: 8.3, desc: "A sexually frustrated suburban father has a mid-life crisis after becoming infatuated with his daughter's best friend.", tags: ["suburban", "mid-life", "beauty", "dark-humor"], mood: "dark" },
  { id: 116, title: "The Iron Claw", year: 2023, genre: ["Biography", "Drama", "Sport"], director: "Sean Durkin", rating: 7.6, desc: "The true story of the Von Erich family, who made an indelible mark on professional wrestling.", tags: ["wrestling", "family", "tragedy", "sports"], mood: "emotional" },
  { id: 117, title: "Barbie", year: 2023, genre: ["Adventure", "Comedy", "Fantasy"], director: "Greta Gerwig", rating: 6.8, desc: "Barbie and Ken are having the time of their lives in the colorful Barbie Land, then get a chance to go to the real world.", tags: ["feminist", "comedy", "colorful", "existential"], mood: "fun" },
  { id: 118, title: "Uncut Gems", year: 2019, genre: ["Crime", "Drama", "Thriller"], director: "Safdie Brothers", rating: 7.4, desc: "A charismatic jeweler makes a high-stakes bet that could lead to the biggest windfall of his life.", tags: ["gambling", "anxiety", "new-york", "hustle"], mood: "intense" },
  { id: 119, title: "In the Mood for Love", year: 2000, genre: ["Drama", "Romance"], director: "Wong Kar-wai", rating: 8.1, desc: "Two neighbors form a strong bond after both suspect extramarital activities of their spouses.", tags: ["unrequited-love", "hong-kong", "restraint", "visual"], mood: "melancholy" },
  { id: 120, title: "Nope", year: 2022, genre: ["Horror", "Mystery", "Sci-Fi"], director: "Jordan Peele", rating: 6.8, desc: "The residents of a lonely gulch in inland California bear witness to an uncanny and chilling discovery.", tags: ["spectacle", "ufo", "horror", "ranch"], mood: "suspenseful" },
  { id: 121, title: "The Northman", year: 2022, genre: ["Action", "Adventure", "Drama"], director: "Robert Eggers", rating: 7.1, desc: "A young Viking prince sets out on a quest to avenge his father's murder.", tags: ["viking", "revenge", "mythological", "brutal"], mood: "epic" },
  { id: 122, title: "Mulholland Drive", year: 2001, genre: ["Drama", "Mystery", "Thriller"], director: "David Lynch", rating: 7.9, desc: "After a car wreck on the winding Mulholland Drive, an amnesiac woman and a young Hollywood hopeful search for clues and answers across Los Angeles.", tags: ["surreal", "mystery", "hollywood", "dream"], mood: "dark" },
  { id: 123, title: "The Banshees of Inisherin", year: 2022, genre: ["Comedy", "Drama"], director: "Martin McDonagh", rating: 7.7, desc: "Two lifelong friends find themselves at an impasse when one abruptly ends their relationship.", tags: ["friendship", "isolation", "irish", "dark-humor"], mood: "melancholy" },
  { id: 124, title: "The Fabelmans", year: 2022, genre: ["Biography", "Drama"], director: "Steven Spielberg", rating: 7.5, desc: "Growing up in post-World War II era Arizona, a young man named Sammy Fabelman discovers a shattering family secret and explores how movies can help us see the truth.", tags: ["coming-of-age", "filmmaking", "family", "autobiographical"], mood: "heartwarming" },
  { id: 125, title: "RRR", year: 2022, genre: ["Action", "Drama"], director: "S.S. Rajamouli", rating: 7.8, desc: "A fictitious story about two legendary revolutionaries and their journey away from and back to British India.", tags: ["indian", "action", "friendship", "colonial"], mood: "epic" },
  { id: 126, title: "Tár", year: 2022, genre: ["Drama", "Music"], director: "Todd Field", rating: 7.4, desc: "A renowned conductor faces a reckoning when her past catches up with her.", tags: ["music", "power", "cancel-culture", "character-study"], mood: "intense" },
  { id: 127, title: "The Whale", year: 2022, genre: ["Drama"], director: "Darren Aronofsky", rating: 7.7, desc: "A reclusive English teacher attempts to reconnect with his estranged teenage daughter.", tags: ["redemption", "family", "grief", "chamber-piece"], mood: "emotional" },
  { id: 128, title: "Past Lives", year: 2023, genre: ["Drama", "Romance"], director: "Celine Song", rating: 7.8, desc: "Nora and Hae Sung, two deeply connected childhood friends, are wrenched apart after Nora's family emigrates from South Korea.", tags: ["immigration", "fate", "love", "korean"], mood: "melancholy" },
  { id: 129, title: "Anatomy of a Fall", year: 2023, genre: ["Crime", "Drama", "Thriller"], director: "Justine Triet", rating: 7.7, desc: "A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as the sole witness.", tags: ["courtroom", "marriage", "french", "ambiguity"], mood: "suspenseful" },
  { id: 130, title: "Killers of the Flower Moon", year: 2023, genre: ["Crime", "Drama", "History"], director: "Martin Scorsese", rating: 7.6, desc: "Members of the Osage tribe are murdered under mysterious circumstances in 1920s Oklahoma.", tags: ["indigenous", "true-crime", "historical", "conspiracy"], mood: "intense" },
  { id: 131, title: "Poor Things", year: 2023, genre: ["Comedy", "Drama", "Romance"], director: "Yorgos Lanthimos", rating: 7.8, desc: "The incredible tale of a young woman brought back to life by a brilliant scientist.", tags: ["surreal", "feminist", "victorian", "dark-humor"], mood: "whimsical" },
  { id: 132, title: "The Zone of Interest", year: 2023, genre: ["Drama", "History", "War"], director: "Jonathan Glazer", rating: 7.4, desc: "The commandant of Auschwitz and his wife strive to build a dream life for their family next to the camp.", tags: ["holocaust", "banality-of-evil", "sound-design", "horror"], mood: "dark" },
  { id: 133, title: "American Fiction", year: 2023, genre: ["Comedy", "Drama"], director: "Cord Jefferson", rating: 7.5, desc: "A novelist fed up with the establishment profiting from Black entertainment writes a book to prove a point.", tags: ["satire", "race", "publishing", "meta"], mood: "fun" },
  { id: 134, title: "Saltburn", year: 2023, genre: ["Comedy", "Drama", "Thriller"], director: "Emerald Fennell", rating: 7.0, desc: "A student at Oxford University finds himself drawn into the world of a charming aristocratic classmate.", tags: ["class", "obsession", "british", "twisted"], mood: "dark" },
  { id: 135, title: "All Quiet on the Western Front", year: 2022, genre: ["Action", "Drama", "War"], director: "Edward Berger", rating: 7.8, desc: "A young German soldier's terrifying experiences during World War I.", tags: ["war", "anti-war", "german", "trenches"], mood: "intense" },
  { id: 136, title: "Triangle of Sadness", year: 2022, genre: ["Comedy", "Drama"], director: "Ruben Östlund", rating: 7.3, desc: "A fashion model celebrity couple join an pointless cruise for the super-rich that sinks.", tags: ["satire", "class", "dark-humor", "stranded"], mood: "dark" },
  { id: 137, title: "Decision to Leave", year: 2022, genre: ["Crime", "Drama", "Mystery"], director: "Park Chan-wook", rating: 7.4, desc: "A detective investigating a man's death in the mountains becomes entangled with the dead man's wife.", tags: ["mystery", "romance", "korean", "obsession"], mood: "melancholy" },
  { id: 138, title: "Aftersun", year: 2022, genre: ["Drama"], director: "Charlotte Wells", rating: 7.6, desc: "Sophie reflects on the shared joy and private melancholy of a holiday she took with her father twenty years earlier.", tags: ["memory", "father-daughter", "subtle", "heartbreak"], mood: "melancholy" },
  { id: 139, title: "Marcel the Shell with Shoes On", year: 2021, genre: ["Animation", "Comedy", "Drama"], director: "Dean Fleischer Camp", rating: 7.7, desc: "Marcel is an adorable one-inch-tall shell who ekes out a colorful existence with his grandmother Connie in a Airbnb.", tags: ["whimsical", "documentary-style", "adorable", "loss"], mood: "heartwarming" },
  { id: 140, title: "The Power of the Dog", year: 2021, genre: ["Drama", "Romance", "Western"], director: "Jane Campion", rating: 6.8, desc: "A domineering rancher responds with mocking cruelty when his brother brings home a new wife and her son.", tags: ["western", "toxic-masculinity", "slow-burn", "revenge"], mood: "suspenseful" },
  { id: 141, title: "Dune: Part Two", year: 2024, genre: ["Action", "Adventure", "Drama"], director: "Denis Villeneuve", rating: 8.5, desc: "Paul Atreides unites with the Fremen to take revenge on the conspirators who destroyed his family and stop a terrible future only he can foresee.", tags: ["sci-fi", "desert", "politics", "epic", "prophecy"], mood: "epic" },
  { id: 142, title: "Challengers", year: 2024, genre: ["Drama", "Romance", "Sport"], director: "Luca Guadagnino", rating: 7.5, desc: "A former tennis prodigy turned coach transforms her husband from mediocrity to greatness by pitting him against his former best friend and her former lover.", tags: ["tennis", "rivalry", "love-triangle", "sports"], mood: "intense" },
  { id: 143, title: "Civil War", year: 2024, genre: ["Action", "Drama", "Sci-Fi"], director: "Alex Garland", rating: 6.7, desc: "A team of military-embedded journalists race across a dystopian future America to reach DC before rebel factions descend upon the White House.", tags: ["journalism", "war", "dystopia", "america"], mood: "intense" },
  { id: 144, title: "Inside Out 2", year: 2024, genre: ["Animation", "Adventure", "Comedy"], director: "Kelsey Mann", rating: 7.6, desc: "As Riley enters puberty, new emotions arrive causing upheaval in her mind's Headquarters.", tags: ["emotions", "animation", "puberty", "anxiety"], mood: "heartwarming" },
  { id: 145, title: "Furiosa: A Mad Max Saga", year: 2024, genre: ["Action", "Adventure", "Sci-Fi"], director: "George Miller", rating: 7.5, desc: "The origin story of the rebel warrior Furiosa before her encounter with Mad Max.", tags: ["post-apocalyptic", "revenge", "prequel", "action"], mood: "thrilling" },
  { id: 146, title: "The Substance", year: 2024, genre: ["Drama", "Horror", "Sci-Fi"], director: "Coralie Fargeat", rating: 7.3, desc: "An aging celebrity takes a mysterious drug that creates a younger duplicate of herself.", tags: ["body-horror", "aging", "beauty-standards", "feminist"], mood: "dark" },
  { id: 147, title: "Nosferatu", year: 2024, genre: ["Drama", "Fantasy", "Horror"], director: "Robert Eggers", rating: 7.2, desc: "A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her.", tags: ["vampire", "gothic", "horror", "remake"], mood: "dark" },
  { id: 148, title: "The Brutalist", year: 2024, genre: ["Drama"], director: "Brady Corbet", rating: 7.8, desc: "A Hungarian-born Jewish architect emigrates with his wife to America to rebuild his life after surviving the Holocaust.", tags: ["architecture", "immigration", "american-dream", "art"], mood: "epic" },
  { id: 149, title: "Conclave", year: 2024, genre: ["Drama", "Mystery", "Thriller"], director: "Edward Berger", rating: 7.7, desc: "Following the unexpected death of the Pope, a Cardinal must oversee the selection of a new Pope.", tags: ["vatican", "politics", "mystery", "power"], mood: "suspenseful" },
  { id: 150, title: "A Real Pain", year: 2024, genre: ["Comedy", "Drama"], director: "Jesse Eisenberg", rating: 7.6, desc: "Mismatched cousins reunite for a tour through Poland to honor their beloved grandmother.", tags: ["family", "holocaust", "comedy", "grief"], mood: "bittersweet" },
  { id: 151, title: "Anora", year: 2024, genre: ["Comedy", "Drama", "Romance"], director: "Sean Baker", rating: 7.7, desc: "A young sex worker from Brooklyn gets her chance at a Cinderella story when she meets and impulsively marries the son of an oligarch.", tags: ["romance", "class", "comedy", "gritty"], mood: "fun" },
  { id: 152, title: "The Wild Robot", year: 2024, genre: ["Animation", "Adventure", "Family"], director: "Chris Sanders", rating: 8.1, desc: "A robot shipwrecked on an uninhabited island must learn to adapt to the harsh environment and gradually builds relationships with the island's wildlife.", tags: ["robot", "nature", "animation", "motherhood"], mood: "heartwarming" },
  { id: 153, title: "Wicked", year: 2024, genre: ["Drama", "Fantasy", "Musical"], director: "Jon M. Chu", rating: 7.5, desc: "Misunderstood Elphaba forges an unlikely bond with the popular Glinda, until a clash of worldviews drives them apart.", tags: ["musical", "friendship", "wizard-of-oz", "magic"], mood: "epic" },
  { id: 154, title: "A Complete Unknown", year: 2024, genre: ["Biography", "Drama", "Music"], director: "James Mangold", rating: 7.6, desc: "A young Bob Dylan arrives in New York City in 1961 and shakes up the folk music world before controversially going electric.", tags: ["music", "biography", "60s", "folk"], mood: "inspiring" },
  { id: 155, title: "Sing Sing", year: 2023, genre: ["Drama"], director: "Greg Kwedar", rating: 7.5, desc: "A group of incarcerated men form a theater group within a correctional facility, discovering the transformative power of art.", tags: ["prison", "theater", "redemption", "art"], mood: "inspiring" },
  { id: 156, title: "Wonka", year: 2023, genre: ["Adventure", "Comedy", "Family"], director: "Paul King", rating: 7.1, desc: "The story of how young Willy Wonka and his chocolates changed the world.", tags: ["chocolate", "fantasy", "whimsical", "prequel"], mood: "fun" },
  { id: 157, title: "Bottoms", year: 2023, genre: ["Comedy"], director: "Emma Seligman", rating: 6.6, desc: "Two unpopular queer high schoolers start a fight club as a way to lose their virginity to cheerleaders.", tags: ["teen", "comedy", "queer", "absurd"], mood: "fun" },
  { id: 158, title: "The Holdovers", year: 2023, genre: ["Comedy", "Drama"], director: "Alexander Payne", rating: 7.9, desc: "A curmudgeonly teacher at a boarding school reluctantly babysits students who have no place to go during Christmas break.", tags: ["christmas", "unlikely-friendship", "school", "1970s"], mood: "heartwarming" },
  { id: 159, title: "Priscilla", year: 2023, genre: ["Biography", "Drama", "Romance"], director: "Sofia Coppola", rating: 6.7, desc: "The story of Priscilla Presley's life with Elvis.", tags: ["elvis", "biography", "romance", "power-imbalance"], mood: "melancholy" },
  { id: 160, title: "May December", year: 2023, genre: ["Comedy", "Drama"], director: "Todd Haynes", rating: 7.0, desc: "A Hollywood actress researches a woman who was involved in a tabloid scandal for an upcoming film role.", tags: ["scandal", "meta", "acting", "moral-ambiguity"], mood: "suspenseful" },
  { id: 161, title: "Godzilla Minus One", year: 2023, genre: ["Action", "Adventure", "Drama"], director: "Takashi Yamazaki", rating: 7.8, desc: "Post-war Japan is at its lowest point when a new threat emerges in the form of Godzilla.", tags: ["kaiju", "japanese", "post-war", "action"], mood: "epic" },
  { id: 162, title: "Society of the Snow", year: 2023, genre: ["Adventure", "Biography", "Drama"], director: "J.A. Bayona", rating: 7.8, desc: "The harrowing true story of a Uruguayan rugby team stranded in the Andes after their plane crashes.", tags: ["survival", "true-story", "andes", "human-spirit"], mood: "intense" },
  { id: 163, title: "Perfect Days", year: 2023, genre: ["Drama"], director: "Wim Wenders", rating: 7.9, desc: "A toilet cleaner in Tokyo leads a life of contentment, finding beauty in daily routine.", tags: ["japanese", "minimalism", "routine", "beauty"], mood: "melancholy" },
  { id: 164, title: "Asteroid City", year: 2023, genre: ["Comedy", "Drama", "Romance"], director: "Wes Anderson", rating: 6.5, desc: "A Junior Stargazer convention is disrupted by world-changing events in an American desert town.", tags: ["quirky", "visual", "meta", "ensemble"], mood: "whimsical" },
  { id: 165, title: "Io Capitano", year: 2023, genre: ["Adventure", "Drama"], director: "Matteo Garrone", rating: 7.5, desc: "Two Senegalese teenagers embark on a dangerous journey from Dakar to Europe.", tags: ["migration", "africa", "coming-of-age", "survival"], mood: "intense" },
  { id: 166, title: "Ferrari", year: 2023, genre: ["Biography", "Drama", "History"], director: "Michael Mann", rating: 6.4, desc: "Enzo Ferrari faces a crisis in his auto empire while managing his personal life in 1957.", tags: ["racing", "biography", "italian", "ambition"], mood: "intense" },
  { id: 167, title: "Napoleon", year: 2023, genre: ["Action", "Adventure", "Biography"], director: "Ridley Scott", rating: 6.4, desc: "An epic that details the checkered rise and fall of French Emperor Napoleon Bonaparte and his relentless journey to power.", tags: ["historical", "war", "biography", "conquest"], mood: "epic" },
  { id: 168, title: "The Boy and the Heron", year: 2023, genre: ["Animation", "Adventure", "Drama"], director: "Hayao Miyazaki", rating: 7.5, desc: "A young boy mourning his mother discovers a world shared by the living and the dead.", tags: ["anime", "grief", "magical", "japanese"], mood: "whimsical" },
  { id: 169, title: "Maestro", year: 2023, genre: ["Biography", "Drama", "Music"], director: "Bradley Cooper", rating: 6.6, desc: "A portrait of the complex relationship between Leonard Bernstein and his wife Felicia Montealegre.", tags: ["music", "biography", "marriage", "conducting"], mood: "emotional" },
  { id: 170, title: "Nimona", year: 2023, genre: ["Animation", "Action", "Adventure"], director: "Nick Bruno", rating: 7.6, desc: "A knight framed for a crime teams up with a shapeshifting teen to prove his innocence.", tags: ["animation", "shapeshifter", "identity", "queer"], mood: "fun" },
  { id: 171, title: "Talk to Me", year: 2022, genre: ["Horror", "Thriller"], director: "Danny Philippou", rating: 7.1, desc: "When a group of friends discover how to conjure spirits using an embalmed hand, they become hooked on the new thrill.", tags: ["supernatural", "teen", "horror", "viral"], mood: "dark" },
  { id: 172, title: "John Wick: Chapter 4", year: 2023, genre: ["Action", "Crime", "Thriller"], director: "Chad Stahelski", rating: 7.7, desc: "John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.", tags: ["action", "assassin", "revenge", "stylized"], mood: "thrilling" },
  { id: 173, title: "Guardians of the Galaxy Vol. 3", year: 2023, genre: ["Action", "Adventure", "Comedy"], director: "James Gunn", rating: 7.9, desc: "The team rallies to protect one of their own, a mission that could mean the end of the Guardians.", tags: ["space", "team", "superhero", "emotional"], mood: "emotional" },
  { id: 174, title: "Mission: Impossible – Dead Reckoning Part One", year: 2023, genre: ["Action", "Adventure", "Thriller"], director: "Christopher McQuarrie", rating: 7.7, desc: "Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.", tags: ["spy", "action", "ai-threat", "stunts"], mood: "thrilling" },
  { id: 175, title: "Cocaine Bear", year: 2023, genre: ["Comedy", "Crime", "Thriller"], director: "Elizabeth Banks", rating: 5.9, desc: "An oddball group of cops, criminals and tourists converge in a Georgia forest where a 500-pound black bear goes on a rampage after ingesting cocaine.", tags: ["comedy", "absurd", "animal", "drug"], mood: "fun" },
  { id: 176, title: "The Creator", year: 2023, genre: ["Action", "Adventure", "Sci-Fi"], director: "Gareth Edwards", rating: 6.8, desc: "Against the backdrop of a war between humans and AI, a former agent discovers a weapon that could end the war.", tags: ["ai", "war", "robot", "dystopia"], mood: "epic" },
  { id: 177, title: "Beau Is Afraid", year: 2023, genre: ["Comedy", "Drama", "Horror"], director: "Ari Aster", rating: 5.4, desc: "An anxious man embarks on an increasingly surreal odyssey to get home to his mother.", tags: ["anxiety", "surreal", "mother", "absurd"], mood: "dark" },
  { id: 178, title: "The Killer", year: 2023, genre: ["Action", "Adventure", "Crime"], director: "David Fincher", rating: 6.7, desc: "An assassin begins to develop a conscience, causing an international crisis.", tags: ["assassin", "meticulous", "globe-trotting", "thriller"], mood: "suspenseful" },
  { id: 179, title: "Elemental", year: 2023, genre: ["Animation", "Comedy", "Drama"], director: "Peter Sohn", rating: 7.0, desc: "In a city where fire, water, earth, and air residents live together, a fiery young woman and a go-with-the-flow guy discover they have more in common despite their differences.", tags: ["immigration", "love", "animation", "elements"], mood: "heartwarming" },
  { id: 180, title: "Rye Lane", year: 2023, genre: ["Comedy", "Romance"], director: "Raine Allen-Miller", rating: 7.2, desc: "Two young people wander around South London getting over their recent breakups.", tags: ["romance", "london", "breakup", "fun"], mood: "fun" },
  { id: 181, title: "Tenet", year: 2020, genre: ["Action", "Sci-Fi", "Thriller"], director: "Christopher Nolan", rating: 7.3, desc: "Armed with only one word—Tenet—and fighting for the survival of the world, the protagonist journeys through a twilight world of international espionage.", tags: ["time-inversion", "spy", "mind-bending", "action"], mood: "thrilling" },
  { id: 182, title: "Sound of Metal", year: 2019, genre: ["Drama", "Music"], director: "Darius Marder", rating: 7.8, desc: "A heavy-metal drummer's life is thrown into freefall when he begins to lose his hearing.", tags: ["deafness", "music", "acceptance", "transformation"], mood: "emotional" },
  { id: 183, title: "The Father", year: 2020, genre: ["Drama", "Mystery"], director: "Florian Zeller", rating: 8.2, desc: "A man refuses all assistance from his daughter as he ages. As he tries to make sense of his changing circumstances, he begins to doubt his loved ones.", tags: ["dementia", "aging", "family", "unreliable-perspective"], mood: "emotional" },
  { id: 184, title: "Nomadland", year: 2020, genre: ["Drama"], director: "Chloé Zhao", rating: 7.3, desc: "A woman in her sixties embarks on a journey through the American West, living as a van-dwelling modern-day nomad.", tags: ["nomad", "america", "solitude", "grief"], mood: "melancholy" },
  { id: 185, title: "Another Round", year: 2020, genre: ["Comedy", "Drama"], director: "Thomas Vinterberg", rating: 7.7, desc: "Four high-school teachers consume alcohol on a daily basis to see how it affects their social and professional lives.", tags: ["alcohol", "mid-life", "danish", "experiment"], mood: "bittersweet" },
  { id: 186, title: "Promising Young Woman", year: 2020, genre: ["Crime", "Drama", "Thriller"], director: "Emerald Fennell", rating: 7.5, desc: "A young woman haunted by a traumatic past seeks revenge against those who crossed her path.", tags: ["revenge", "feminist", "dark", "twist"], mood: "dark" },
  { id: 187, title: "Minari", year: 2020, genre: ["Drama"], director: "Lee Isaac Chung", rating: 7.4, desc: "A Korean American family moves to a tiny Arkansas farm in search of the American Dream.", tags: ["family", "korean", "american-dream", "farming"], mood: "heartwarming" },
  { id: 188, title: "Soul", year: 2020, genre: ["Animation", "Adventure", "Comedy"], director: "Pete Docter", rating: 8.0, desc: "A musician who has lost his passion for music is transported out of his body and must find his way back with the help of a young soul.", tags: ["animation", "music", "existential", "purpose"], mood: "inspiring" },
  { id: 189, title: "Thelma & Louise", year: 1991, genre: ["Adventure", "Crime", "Drama"], director: "Ridley Scott", rating: 7.6, desc: "Two best friends set out on an adventure, but it soon turns into a flight from the law when one of them kills a man who tries to assault the other.", tags: ["road-trip", "feminist", "friendship", "freedom"], mood: "thrilling" },
  { id: 190, title: "The Truman Show", year: 1998, genre: ["Comedy", "Drama"], director: "Peter Weir", rating: 8.2, desc: "An insurance salesman discovers his whole life is actually a reality TV show.", tags: ["reality", "freedom", "media", "identity"], mood: "thought-provoking" },
  { id: 191, title: "Trainspotting", year: 1996, genre: ["Drama"], director: "Danny Boyle", rating: 8.1, desc: "Renton attempts to give up his heroin addiction as he and his friends sink deeper into despair.", tags: ["addiction", "scottish", "youth", "dark-humor"], mood: "edgy" },
  { id: 192, title: "The Grand Illusion", year: 1937, genre: ["Drama", "War"], director: "Jean Renoir", rating: 8.1, desc: "During World War I, two French soldiers are captured and held in a German prisoner-of-war camp, where class differences become apparent.", tags: ["war", "class", "french", "classic"], mood: "thought-provoking" },
  { id: 193, title: "Rashomon", year: 1950, genre: ["Crime", "Drama", "Mystery"], director: "Akira Kurosawa", rating: 8.2, desc: "The rape of a bride and the murder of her samurai husband are recalled from the perspectives of various witnesses.", tags: ["perspective", "truth", "japanese", "classic"], mood: "thought-provoking" },
  { id: 194, title: "Singin' in the Rain", year: 1952, genre: ["Comedy", "Musical", "Romance"], director: "Stanley Donen", rating: 8.3, desc: "A silent film star falls for a young actress just as the movie industry is transitioning to sound.", tags: ["musical", "hollywood", "classic", "joyful"], mood: "fun" },
  { id: 195, title: "Psycho", year: 1960, genre: ["Horror", "Mystery", "Thriller"], director: "Alfred Hitchcock", rating: 8.5, desc: "A secretary on the run checks into a secluded motel run by a young man under his mother's domination.", tags: ["horror", "twist", "classic", "motel"], mood: "suspenseful" },
  { id: 196, title: "The Apartment", year: 1960, genre: ["Comedy", "Drama", "Romance"], director: "Billy Wilder", rating: 8.3, desc: "A man tries to rise in his company by lending his apartment to executives, but things get complicated when he falls for their elevator operator.", tags: ["romance", "corporate", "classic", "witty"], mood: "bittersweet" },
  { id: 197, title: "Vertigo", year: 1958, genre: ["Mystery", "Romance", "Thriller"], director: "Alfred Hitchcock", rating: 8.3, desc: "A former San Francisco police detective juggles pursuing a woman he is attracted to and his fear of heights.", tags: ["obsession", "classic", "identity", "psychological"], mood: "suspenseful" },
  { id: 198, title: "Sunset Boulevard", year: 1950, genre: ["Drama", "Film-Noir"], director: "Billy Wilder", rating: 8.4, desc: "A screenwriter develops a dangerous relationship with a faded film star determined to make a triumphant return.", tags: ["hollywood", "obsession", "classic", "noir"], mood: "dark" },
  { id: 199, title: "Seven Samurai", year: 1954, genre: ["Action", "Drama"], director: "Akira Kurosawa", rating: 8.6, desc: "Farmers from a village exploited by bandits hire seven ronin to protect them.", tags: ["samurai", "honor", "japanese", "epic"], mood: "epic" },
  { id: 200, title: "North by Northwest", year: 1959, genre: ["Action", "Adventure", "Mystery"], director: "Alfred Hitchcock", rating: 8.3, desc: "A New York City advertising executive is mistaken for a government agent by a group of foreign spies.", tags: ["mistaken-identity", "chase", "classic", "spy"], mood: "thrilling" },
  { id: 201, title: "Casablanca", year: 1942, genre: ["Drama", "Romance", "War"], director: "Michael Curtiz", rating: 8.5, desc: "A cynical expatriate American cafe owner struggles with whether to help his former lover and her husband escape the Nazis in French Morocco.", tags: ["war", "romance", "classic", "sacrifice"], mood: "emotional" },
  { id: 202, title: "Bicycle Thieves", year: 1948, genre: ["Drama"], director: "Vittorio De Sica", rating: 8.3, desc: "In post-war Italy, a working-class man's bicycle is stolen, and he searches the city with his young son to find it.", tags: ["neorealism", "poverty", "italian", "father-son"], mood: "melancholy" },
  { id: 203, title: "Cinema Paradiso", year: 1988, genre: ["Drama", "Romance"], director: "Giuseppe Tornatore", rating: 8.5, desc: "A filmmaker recalls his childhood when he fell in love with the movies at his village's cinema and formed a deep friendship with the theater's projectionist.", tags: ["cinema", "nostalgia", "italian", "friendship"], mood: "heartwarming" },
  { id: 204, title: "Once Upon a Time in the West", year: 1968, genre: ["Western"], director: "Sergio Leone", rating: 8.5, desc: "A mysterious stranger with a harmonica joins forces with a notorious desperado to protect a beautiful widow from a ruthless assassin.", tags: ["western", "revenge", "classic", "epic"], mood: "epic" },
  { id: 205, title: "The Godfather Part II", year: 1974, genre: ["Crime", "Drama"], director: "Francis Ford Coppola", rating: 9.0, desc: "The early life and career of Vito Corleone is contrasted with the reign of his son Michael as the new don.", tags: ["mafia", "family", "power", "rise-and-fall"], mood: "intense" },
  { id: 206, title: "Apocalypse Now", year: 1979, genre: ["Drama", "Mystery", "War"], director: "Francis Ford Coppola", rating: 8.4, desc: "A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces Colonel.", tags: ["vietnam", "madness", "war", "journey"], mood: "dark" },
  { id: 207, title: "The Godfather Part III", year: 1990, genre: ["Crime", "Drama"], director: "Francis Ford Coppola", rating: 7.6, desc: "In the midst of trying to legitimize his business dealings in 1979 New York and Italy, aging mafia don Michael Corleone seeks to vow for his sins.", tags: ["mafia", "redemption", "family", "decline"], mood: "melancholy" },
  { id: 208, title: "Raiders of the Lost Ark", year: 1981, genre: ["Action", "Adventure"], director: "Steven Spielberg", rating: 8.4, desc: "Archaeologist Indiana Jones races against the Nazis to find the lost Ark of the Covenant.", tags: ["adventure", "archaeology", "nazi", "treasure"], mood: "thrilling" },
  { id: 209, title: "The Conversation", year: 1974, genre: ["Crime", "Drama", "Mystery"], director: "Francis Ford Coppola", rating: 7.8, desc: "A paranoid surveillance expert has a crisis of conscience when he suspects that a couple he is spying on will be murdered.", tags: ["surveillance", "paranoia", "privacy", "70s"], mood: "suspenseful" },
  { id: 210, title: "E.T. the Extra-Terrestrial", year: 1982, genre: ["Family", "Sci-Fi"], director: "Steven Spielberg", rating: 7.9, desc: "A troubled child summons the courage to help a friendly alien escape Earth and return home.", tags: ["alien", "friendship", "childhood", "family"], mood: "heartwarming" },
  { id: 211, title: "Chinatown", year: 1974, genre: ["Drama", "Mystery", "Thriller"], director: "Roman Polanski", rating: 8.1, desc: "A private detective investigating a routine case stumbles upon a conspiracy involving corruption and murder in 1930s Los Angeles.", tags: ["noir", "corruption", "detective", "classic"], mood: "dark" },
  { id: 212, title: "Do the Right Thing", year: 1989, genre: ["Drama"], director: "Spike Lee", rating: 8.0, desc: "On the hottest day of the year in a Brooklyn neighborhood, tensions between the diverse residents escalate.", tags: ["race", "brooklyn", "tension", "social-commentary"], mood: "intense" },
  { id: 213, title: "Amadeus", year: 1984, genre: ["Biography", "Drama", "Music"], director: "Miloš Forman", rating: 8.4, desc: "The life, success, and troubles of Wolfgang Amadeus Mozart, as told by Antonio Salieri.", tags: ["music", "jealousy", "genius", "classical"], mood: "epic" },
  { id: 214, title: "My Neighbor Totoro", year: 1988, genre: ["Animation", "Family", "Fantasy"], director: "Hayao Miyazaki", rating: 8.1, desc: "When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits.", tags: ["anime", "magical", "childhood", "nature"], mood: "whimsical" },
  { id: 215, title: "The Princess Mononoke", year: 1997, genre: ["Animation", "Action", "Adventure"], director: "Hayao Miyazaki", rating: 8.4, desc: "On a journey to find the cure for a demon's curse, a young warrior discovers a conflict between a mining colony and the forest spirits.", tags: ["anime", "nature", "conflict", "epic"], mood: "epic" },
  { id: 216, title: "Akira", year: 1988, genre: ["Animation", "Action", "Sci-Fi"], director: "Katsuhiro Otomo", rating: 8.0, desc: "A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath.", tags: ["anime", "cyberpunk", "psychic", "dystopia"], mood: "dark" },
  { id: 217, title: "Grave of the Fireflies", year: 1988, genre: ["Animation", "Drama", "War"], director: "Isao Takahata", rating: 8.5, desc: "A young boy and his little sister struggle to survive in Japan during World War II.", tags: ["war", "anime", "tragedy", "siblings"], mood: "emotional" },
  { id: 218, title: "The Night of the Hunter", year: 1955, genre: ["Crime", "Drama", "Film-Noir"], director: "Charles Laughton", rating: 8.0, desc: "A self-proclaimed preacher marries a gullible widow whose children are hiding their murdered father's stolen money.", tags: ["noir", "religion", "children", "thriller"], mood: "suspenseful" },
  { id: 219, title: "The Third Man", year: 1949, genre: ["Film-Noir", "Mystery", "Thriller"], director: "Carol Reed", rating: 8.1, desc: "Searching for his mysterious friend Harry Lime in postwar Vienna, Holly Martins discovers the friend's involvement in racketeering.", tags: ["noir", "vienna", "post-war", "classic"], mood: "suspenseful" },
  { id: 220, title: "M", year: 1931, genre: ["Crime", "Mystery", "Thriller"], director: "Fritz Lang", rating: 8.3, desc: "When the police in a German city are unable to catch a child-murderer, other criminals decide to do the job themselves.", tags: ["serial-killer", "justice", "german", "classic"], mood: "dark" },
  { id: 221, title: "Wild Strawberries", year: 1957, genre: ["Drama", "Romance"], director: "Ingmar Bergman", rating: 8.1, desc: "An elderly professor revisits past memories and comes to terms with his life as he travels to receive an honorary degree.", tags: ["memory", "aging", "existential", "swedish"], mood: "melancholy" },
  { id: 222, title: "The 400 Blows", year: 1959, genre: ["Crime", "Drama"], director: "François Truffaut", rating: 8.1, desc: "A young Parisian boy runs afoul of his parents and teachers, eventually landing in a reformatory.", tags: ["coming-of-age", "french", "rebellion", "classic"], mood: "melancholy" },
  { id: 223, title: "8½", year: 1963, genre: ["Comedy", "Drama"], director: "Federico Fellini", rating: 8.0, desc: "A harried movie director retreats into his memories and fantasies.", tags: ["meta", "filmmaking", "italian", "dreams"], mood: "whimsical" },
  { id: 224, title: "Wings of Desire", year: 1987, genre: ["Drama", "Fantasy", "Romance"], director: "Wim Wenders", rating: 8.0, desc: "An angel tires of overseeing human activity and wishes to become human when he falls in love with a beautiful trapeze artist.", tags: ["angel", "berlin", "philosophical", "love"], mood: "melancholy" },
  { id: 225, title: "Paris, Texas", year: 1984, genre: ["Drama"], director: "Wim Wenders", rating: 8.1, desc: "A wandering man in the desert reconnects with his young son and attempts to reunite with his estranged wife.", tags: ["road-trip", "family", "redemption", "american-landscape"], mood: "melancholy" },
  { id: 226, title: "Solaris", year: 1972, genre: ["Drama", "Mystery", "Sci-Fi"], director: "Andrei Tarkovsky", rating: 8.1, desc: "A psychologist is sent to a station orbiting a distant planet in order to discover what has caused the crew to go insane.", tags: ["space", "philosophical", "russian", "consciousness"], mood: "thought-provoking" },
  { id: 227, title: "All About Eve", year: 1950, genre: ["Drama"], director: "Joseph L. Mankiewicz", rating: 8.2, desc: "A seemingly timid but secretly ambitious fan of a Broadway star maneuvers herself into becoming her understudy.", tags: ["theater", "ambition", "classic", "rivalry"], mood: "intense" },
  { id: 228, title: "The Seventh Seal", year: 1957, genre: ["Drama", "Fantasy"], director: "Ingmar Bergman", rating: 8.1, desc: "A knight returning from the Crusades seeks answers about life, death, and the existence of God as he plays chess against the Grim Reaper.", tags: ["death", "existential", "medieval", "philosophical"], mood: "thought-provoking" },
  { id: 229, title: "Persona", year: 1966, genre: ["Drama", "Thriller"], director: "Ingmar Bergman", rating: 8.1, desc: "A nurse is put in charge of a mute actress and finds that their personalities begin to merge.", tags: ["identity", "silence", "psychological", "art-house"], mood: "dark" },
  { id: 230, title: "Metropolis", year: 1927, genre: ["Drama", "Sci-Fi"], director: "Fritz Lang", rating: 8.3, desc: "In a futuristic city sharply divided between the working class and the city planners, the son of the city's mastermind falls in love with a working-class prophet.", tags: ["dystopia", "class", "robot", "silent-film"], mood: "epic" },
  { id: 231, title: "The Passion of Joan of Arc", year: 1928, genre: ["Biography", "Drama", "History"], director: "Carl Theodor Dreyer", rating: 8.1, desc: "A chronicle of the trial of Joan of Arc based on historical records.", tags: ["religious", "trial", "silent-film", "emotion"], mood: "emotional" },
  { id: 232, title: "La Dolce Vita", year: 1960, genre: ["Comedy", "Drama"], director: "Federico Fellini", rating: 8.0, desc: "A journalist explores Rome's decadent high society while struggling with his own desires.", tags: ["rome", "decadence", "italian", "existential"], mood: "melancholy" },
  { id: 233, title: "Contempt", year: 1963, genre: ["Drama"], director: "Jean-Luc Godard", rating: 7.5, desc: "A screenwriter accepts a Hollywood producer's offer to rewrite a film, leading to marital conflict.", tags: ["filmmaking", "marriage", "french", "art-house"], mood: "melancholy" },
  { id: 234, title: "Tokyo Story", year: 1953, genre: ["Drama"], director: "Yasujirō Ozu", rating: 8.2, desc: "An aging couple visit their children and grandchildren in the city, but receive a cold welcome.", tags: ["family", "aging", "japanese", "classic"], mood: "melancholy" },
  { id: 235, title: "Pather Panchali", year: 1955, genre: ["Drama"], director: "Satyajit Ray", rating: 8.3, desc: "Depicts the childhood of Apu, a boy in a poor family living in rural Bengal.", tags: ["poverty", "indian", "coming-of-age", "neorealism"], mood: "emotional" },
  { id: 236, title: "Ikiru", year: 1952, genre: ["Drama"], director: "Akira Kurosawa", rating: 8.3, desc: "A bureaucrat tries to find a meaning in his life after being diagnosed with a terminal illness.", tags: ["mortality", "meaning", "japanese", "bureaucracy"], mood: "inspiring" },
  { id: 237, title: "Andrei Rublev", year: 1966, genre: ["Biography", "Drama", "History"], director: "Andrei Tarkovsky", rating: 8.1, desc: "The life, times, and afflictions of the fifteenth-century Russian iconographer.", tags: ["art", "russian", "medieval", "spiritual"], mood: "epic" },
  { id: 238, title: "Aguirre, the Wrath of God", year: 1972, genre: ["Action", "Adventure", "Biography"], director: "Werner Herzog", rating: 7.8, desc: "In the 16th century, a ruthless Spanish conquistador leads a doomed expedition down the Amazon River.", tags: ["madness", "jungle", "conquest", "german"], mood: "dark" },
  { id: 239, title: "Breathless", year: 1960, genre: ["Crime", "Drama"], director: "Jean-Luc Godard", rating: 7.8, desc: "A small-time thief steals a car and impulsively murders a motorcycle policeman, then tries to persuade a young American student to run away with him.", tags: ["french-new-wave", "romance", "crime", "rebellious"], mood: "edgy" },
  { id: 240, title: "In the Mood for Love", year: 2000, genre: ["Drama", "Romance"], director: "Wong Kar-wai", rating: 8.1, desc: "Two neighbors form a strong bond after discovering their spouses' affair.", tags: ["unrequited-love", "hong-kong", "restraint", "beautiful"], mood: "melancholy" },
  { id: 241, title: "Yi Yi", year: 2000, genre: ["Drama"], director: "Edward Yang", rating: 8.1, desc: "Each member of a middle-class Taipei family is affected by various facets of life, from romance and family to career and death.", tags: ["family", "taiwanese", "life", "observation"], mood: "melancholy" },
  { id: 242, title: "Spirited Away", year: 2001, genre: ["Animation", "Adventure", "Family"], director: "Hayao Miyazaki", rating: 8.6, desc: "A young girl enters a mystical spirit world to save her transformed parents.", tags: ["anime", "magical", "coming-of-age", "japanese"], mood: "whimsical" },
  { id: 243, title: "The Lives of Others", year: 2006, genre: ["Drama", "Mystery", "Thriller"], director: "Florian Henckel von Donnersmarck", rating: 8.4, desc: "In 1984 East Berlin, an agent of the secret police conducts surveillance on a writer and his lover and finds himself increasingly absorbed by their lives.", tags: ["surveillance", "cold-war", "german", "conscience"], mood: "emotional" },
  { id: 244, title: "Capernaum", year: 2018, genre: ["Drama"], director: "Nadine Labaki", rating: 8.4, desc: "While serving a five-year sentence for a violent crime, a 12-year-old Lebanese boy sues his parents for giving him life.", tags: ["poverty", "childhood", "lebanese", "social-commentary"], mood: "emotional" },
  { id: 245, title: "The Intouchables", year: 2011, genre: ["Biography", "Comedy", "Drama"], director: "Olivier Nakache", rating: 8.5, desc: "After a paragliding accident, an aristocrat hires a young man from the projects as his caregiver.", tags: ["friendship", "disability", "french", "class"], mood: "heartwarming" },
  { id: 246, title: "Shoplifters", year: 2018, genre: ["Crime", "Drama"], director: "Hirokazu Kore-eda", rating: 7.9, desc: "A family of small-time crooks take in a child they find on the street.", tags: ["family", "poverty", "japanese", "identity"], mood: "emotional" },
  { id: 247, title: "Burning", year: 2018, genre: ["Drama", "Mystery"], director: "Lee Chang-dong", rating: 7.5, desc: "A young man is disturbed after meeting a mysterious character introduced by his childhood friend.", tags: ["mystery", "class", "korean", "slow-burn"], mood: "suspenseful" },
  { id: 248, title: "Cold War", year: 2018, genre: ["Drama", "Music", "Romance"], director: "Paweł Pawlikowski", rating: 7.6, desc: "In the Cold War era of the 1950s, a music director falls in love with a singer.", tags: ["romance", "cold-war", "polish", "music"], mood: "melancholy" },
  { id: 249, title: "The Handmaid's Tale", year: 1990, genre: ["Drama", "Sci-Fi", "Thriller"], director: "Volker Schlöndorff", rating: 6.0, desc: "In a dystopian near-future, a woman is forced into sexual servitude for reproduction purposes.", tags: ["dystopia", "feminist", "totalitarian", "adaptation"], mood: "dark" },
  { id: 250, title: "Memories of Murder", year: 2003, genre: ["Crime", "Drama", "Mystery"], director: "Bong Joon-ho", rating: 8.1, desc: "In a small Korean province in 1986, three detectives struggle with the investigation of South Korea's first serial murders.", tags: ["serial-killer", "investigation", "korean", "true-crime"], mood: "suspenseful" },
];

// ─── TF-IDF ENGINE ───
function buildTfIdf(movies) {
  const docs = movies.map(m => {
    const text = [
      m.title, m.desc, ...m.genre, m.director,
      ...m.tags, m.mood, m.year.toString()
    ].join(" ").toLowerCase();
    return text.split(/\W+/).filter(Boolean);
  });

  const df = {};
  docs.forEach(tokens => {
    const unique = new Set(tokens);
    unique.forEach(t => { df[t] = (df[t] || 0) + 1; });
  });

  const N = docs.length;
  const idf = {};
  Object.keys(df).forEach(t => { idf[t] = Math.log(N / (1 + df[t])); });

  const vectors = docs.map(tokens => {
    const tf = {};
    tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
    const maxTf = Math.max(...Object.values(tf));
    const vec = {};
    Object.keys(tf).forEach(t => {
      vec[t] = (0.5 + 0.5 * tf[t] / maxTf) * (idf[t] || 0);
    });
    return vec;
  });

  return { vectors, idf };
}

function cosineSim(a, b) {
  let dot = 0, magA = 0, magB = 0;
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  keys.forEach(k => {
    const va = a[k] || 0, vb = b[k] || 0;
    dot += va * vb;
    magA += va * va;
    magB += vb * vb;
  });
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function textToVec(text, idf) {
  const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
  const tf = {};
  tokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
  const maxTf = Math.max(1, ...Object.values(tf));
  const vec = {};
  Object.keys(tf).forEach(t => {
    vec[t] = (0.5 + 0.5 * tf[t] / maxTf) * (idf[t] || 0);
  });
  return vec;
}

// ─── RECOMMENDATION ENGINE ───
function getContentBasedRecs(likedIds, dislikedIds, ratings, movies, tfidf, topK = 10) {
  const { vectors, idf } = tfidf;
  const seen = new Set([...likedIds, ...dislikedIds, ...Object.keys(ratings).map(Number)]);

  // build profile from positive signals
  const posIds = [...likedIds, ...Object.keys(ratings).filter(id => ratings[id] >= 4).map(Number)];
  const negIds = [...dislikedIds, ...Object.keys(ratings).filter(id => ratings[id] <= 2).map(Number)];

  if (posIds.length === 0) return [];

  const profileVec = {};
  posIds.forEach(id => {
    const idx = movies.findIndex(m => m.id === id);
    if (idx < 0) return;
    const v = vectors[idx];
    Object.keys(v).forEach(k => { profileVec[k] = (profileVec[k] || 0) + v[k]; });
  });
  negIds.forEach(id => {
    const idx = movies.findIndex(m => m.id === id);
    if (idx < 0) return;
    const v = vectors[idx];
    Object.keys(v).forEach(k => { profileVec[k] = (profileVec[k] || 0) - v[k] * 0.5; });
  });

  const scored = movies
    .map((m, i) => {
      if (seen.has(m.id)) return null;
      const sim = cosineSim(profileVec, vectors[i]);
      return { movie: m, score: sim, idx: i };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map(s => {
    const likedMovies = posIds.map(id => movies.find(m => m.id === id)).filter(Boolean);
    const explanation = generateExplanation(s.movie, likedMovies, tfidf, movies);
    return { ...s, explanation };
  });
}

function generateExplanation(movie, likedMovies, tfidf, allMovies) {
  // Find shared attributes
  const sharedGenres = [];
  const sharedTags = [];
  const sharedMoods = [];
  const sharedDirectors = [];
  const closestLiked = [];

  likedMovies.forEach(liked => {
    const commonG = movie.genre.filter(g => liked.genre.includes(g));
    commonG.forEach(g => { if (!sharedGenres.includes(g)) sharedGenres.push(g); });
    const commonT = movie.tags.filter(t => liked.tags.includes(t));
    commonT.forEach(t => { if (!sharedTags.includes(t)) sharedTags.push(t); });
    if (movie.mood === liked.mood && !sharedMoods.includes(movie.mood)) sharedMoods.push(movie.mood);
    if (movie.director === liked.director) sharedDirectors.push(liked.title);

    const idx1 = allMovies.findIndex(m => m.id === movie.id);
    const idx2 = allMovies.findIndex(m => m.id === liked.id);
    if (idx1 >= 0 && idx2 >= 0) {
      const sim = cosineSim(tfidf.vectors[idx1], tfidf.vectors[idx2]);
      closestLiked.push({ title: liked.title, sim });
    }
  });

  closestLiked.sort((a, b) => b.sim - a.sim);

  const parts = [];
  if (sharedDirectors.length > 0) {
    parts.push(`Directed by ${movie.director}, whose work you enjoyed in "${sharedDirectors[0]}"`);
  }
  if (closestLiked.length > 0) {
    parts.push(`Strong thematic similarity to "${closestLiked[0].title}" (${(closestLiked[0].sim * 100).toFixed(0)}% match)`);
  }
  if (sharedGenres.length > 0) {
    parts.push(`Shares ${sharedGenres.slice(0, 3).join(", ")} genre elements you gravitate toward`);
  }
  if (sharedTags.length > 0) {
    parts.push(`Features themes of ${sharedTags.slice(0, 4).join(", ")} that align with your taste`);
  }
  if (sharedMoods.length > 0) {
    parts.push(`Has a ${sharedMoods[0]} tone matching your preferred mood`);
  }

  return parts.length > 0 ? parts.slice(0, 3).join(". ") + "." : `Matches your overall preference profile with ${movie.genre.join("/")} elements.`;
}

function getNLPRecs(query, movies, tfidf, excludeIds = [], topK = 10) {
  const { vectors, idf } = tfidf;
  const queryVec = textToVec(query, idf);
  const excluded = new Set(excludeIds);

  return movies
    .map((m, i) => {
      if (excluded.has(m.id)) return null;
      const sim = cosineSim(queryVec, vectors[i]);
      return { movie: m, score: sim, idx: i };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => {
      const queryTokens = query.toLowerCase().split(/\W+/);
      const matchedTags = s.movie.tags.filter(t => queryTokens.some(q => t.includes(q) || q.includes(t)));
      const matchedGenres = s.movie.genre.filter(g => queryTokens.some(q => g.toLowerCase().includes(q)));
      const matchedMood = queryTokens.some(q => s.movie.mood.includes(q));

      const parts = [];
      if (matchedGenres.length) parts.push(`Matches your interest in ${matchedGenres.join(", ")} films`);
      if (matchedTags.length) parts.push(`Contains "${matchedTags.slice(0, 3).join('", "')}" themes you described`);
      if (matchedMood) parts.push(`Has the ${s.movie.mood} tone you're looking for`);
      if (parts.length === 0) {
        parts.push(`High semantic match to "${query.slice(0, 50)}" based on description and thematic analysis`);
      }

      return { ...s, explanation: parts.join(". ") + "." };
    });
}

// ─── LLM RECOMMENDATIONS ───
async function getLLMRecs(query, likedMovies, dislikedMovies, ratings, movies) {
  const ratedInfo = Object.entries(ratings).map(([id, r]) => {
    const m = movies.find(mv => mv.id === Number(id));
    return m ? `"${m.title}" (${r}/5)` : null;
  }).filter(Boolean);

  const prompt = `You are a movie recommendation system. Based on the user's preferences, recommend 6 movies from the provided catalog. For each, explain WHY specifically based on the user's taste.

USER PREFERENCES:
${query ? `Description: "${query}"` : ""}
${likedMovies.length ? `Liked: ${likedMovies.map(m => `"${m.title}"`).join(", ")}` : ""}
${dislikedMovies.length ? `Disliked: ${dislikedMovies.map(m => `"${m.title}"`).join(", ")}` : ""}
${ratedInfo.length ? `Ratings: ${ratedInfo.join(", ")}` : ""}

AVAILABLE MOVIES (return ONLY from this list):
${movies.slice(0, 250).map(m => `ID:${m.id} "${m.title}" (${m.year}) [${m.genre.join(",")}] ${m.mood} - ${m.tags.join(",")}`).join("\n")}

Return ONLY valid JSON array, no markdown, no backticks:
[{"id": <number>, "title": "<string>", "explanation": "<specific 1-2 sentence explanation referencing user preferences and movie attributes>"}]`;

  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("Set VITE_ANTHROPIC_API_KEY in .env to use LLM mode");
      return null;
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: "You are a movie recommendation engine. Return ONLY a JSON array. No markdown formatting, no code blocks, no explanation outside the JSON. Each recommendation must reference specific user preferences.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    const text = data.content.map(i => i.text || "").join("\n");
    const clean = text.replace(/```json|```/g, "").trim();
    const recs = JSON.parse(clean);
    return recs.map(r => {
      const movie = movies.find(m => m.id === r.id);
      return movie ? { movie, score: 0.95, explanation: r.explanation } : null;
    }).filter(Boolean);
  } catch (e) {
    console.error("LLM error:", e);
    return null;
  }
}

// ─── EVALUATION METRICS ───
function computeMetrics(recs, likedIds, allMovies) {
  if (recs.length === 0) return { precisionAt5: 0, diversityScore: 0, coverageScore: 0, ndcg: 0, avgScore: 0 };

  const topK = Math.min(5, recs.length);
  const topRecs = recs.slice(0, topK);

  // Precision@K (via genre overlap proxy)
  const likedGenres = new Set();
  likedIds.forEach(id => {
    const m = allMovies.find(mv => mv.id === id);
    if (m) m.genre.forEach(g => likedGenres.add(g));
  });
  const relevant = topRecs.filter(r => r.movie.genre.some(g => likedGenres.has(g))).length;
  const precisionAt5 = likedIds.length > 0 ? relevant / topK : 0;

  // Diversity (genre variety in recommendations)
  const recGenres = new Set();
  recs.forEach(r => r.movie.genre.forEach(g => recGenres.add(g)));
  const allGenres = new Set();
  allMovies.forEach(m => m.genre.forEach(g => allGenres.add(g)));
  const diversityScore = recGenres.size / Math.max(1, Math.min(recs.length * 2, allGenres.size));

  // Coverage
  const coverageScore = recGenres.size / allGenres.size;

  // NDCG
  let dcg = 0, idcg = 0;
  topRecs.forEach((r, i) => {
    const rel = r.movie.genre.some(g => likedGenres.has(g)) ? 1 : 0;
    dcg += rel / Math.log2(i + 2);
    idcg += 1 / Math.log2(i + 2);
  });
  const ndcg = idcg > 0 ? dcg / idcg : 0;

  const avgScore = recs.reduce((s, r) => s + r.score, 0) / recs.length;

  return { precisionAt5, diversityScore, coverageScore, ndcg, avgScore };
}


// ─── UI COMPONENTS ───
const MOOD_COLORS = {
  inspiring: "#22c55e", intense: "#ef4444", thrilling: "#f97316", edgy: "#a855f7",
  emotional: "#3b82f6", epic: "#eab308", dark: "#6b7280", heartwarming: "#f472b6",
  whimsical: "#06b6d4", "thought-provoking": "#8b5cf6", fun: "#84cc16",
  suspenseful: "#dc2626", melancholy: "#6366f1", bittersweet: "#d97706",
};

const StarRating = ({ value, onChange, size = 20 }) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); onChange(i); }}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            color: i <= (hover || value) ? "#facc15" : "#4a4a5a",
            fontSize: size, lineHeight: 1, transition: "transform 0.15s",
            transform: i <= hover ? "scale(1.2)" : "scale(1)",
          }}
        >★</button>
      ))}
    </div>
  );
};

const MoodTag = ({ mood }) => (
  <span style={{
    display: "inline-block", padding: "2px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
    background: (MOOD_COLORS[mood] || "#666") + "22",
    color: MOOD_COLORS[mood] || "#999",
    border: `1px solid ${(MOOD_COLORS[mood] || "#666")}44`,
    textTransform: "uppercase",
  }}>{mood}</span>
);

const MetricBar = ({ label, value, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, color: "#b0b0c0" }}>
      <span>{label}</span><span style={{ color, fontWeight: 700 }}>{(value * 100).toFixed(1)}%</span>
    </div>
    <div style={{ height: 6, borderRadius: 3, background: "#1e1e2e", overflow: "hidden" }}>
      <div style={{
        width: `${value * 100}%`, height: "100%", borderRadius: 3,
        background: `linear-gradient(90deg, ${color}, ${color}99)`,
        transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
      }} />
    </div>
  </div>
);

const MovieCard = ({ movie, onLike, onDislike, onRate, rating, isLiked, isDisliked, explanation, score }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: "linear-gradient(135deg, #16162a 0%, #1a1a2e 100%)",
        borderRadius: 14, padding: 20, cursor: "pointer",
        border: isLiked ? "1.5px solid #22c55e55" : isDisliked ? "1.5px solid #ef444455" : "1px solid #2a2a3e",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        position: "relative", overflow: "hidden",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px #0008"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {score !== undefined && (
        <div style={{
          position: "absolute", top: 12, right: 12, padding: "3px 10px",
          borderRadius: 8, fontSize: 11, fontWeight: 700,
          background: score > 0.7 ? "#22c55e22" : score > 0.4 ? "#eab30822" : "#3b82f622",
          color: score > 0.7 ? "#22c55e" : score > 0.4 ? "#eab308" : "#3b82f6",
          fontFamily: "'JetBrains Mono', monospace",
        }}>{(score * 100).toFixed(0)}% match</div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            margin: 0, fontSize: 16, fontWeight: 700, color: "#f0f0f8",
            fontFamily: "'Newsreader', 'Georgia', serif",
            lineHeight: 1.3, marginBottom: 4,
          }}>{movie.title}</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#8888a0" }}>{movie.year}</span>
            <span style={{ fontSize: 12, color: "#8888a0" }}>·</span>
            <span style={{ fontSize: 12, color: "#8888a0" }}>{movie.director}</span>
            <span style={{ fontSize: 12, color: "#8888a0" }}>·</span>
            <span style={{ fontSize: 12, color: "#facc15", fontWeight: 600 }}>★ {movie.rating}</span>
          </div>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
            {movie.genre.map(g => (
              <span key={g} style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 4,
                background: "#2a2a3e", color: "#9999b0", fontWeight: 500,
              }}>{g}</span>
            ))}
            <MoodTag mood={movie.mood} />
          </div>
        </div>
      </div>

      {explanation && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, marginTop: 4, marginBottom: 8,
          background: "linear-gradient(135deg, #22c55e08 0%, #3b82f608 100%)",
          border: "1px solid #22c55e15",
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", marginBottom: 4, letterSpacing: 1, textTransform: "uppercase" }}>
            Why this recommendation
          </div>
          <p style={{ margin: 0, fontSize: 12.5, color: "#c0c0d0", lineHeight: 1.5 }}>{explanation}</p>
        </div>
      )}

      {expanded && (
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#9999b0", lineHeight: 1.6 }}>{movie.desc}</p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 8 }}>
            {movie.tags.map(t => (
              <span key={t} style={{ fontSize: 10, color: "#7777a0", padding: "2px 6px", background: "#1e1e30", borderRadius: 4 }}>#{t}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <button
          onClick={e => { e.stopPropagation(); onLike(movie.id); }}
          style={{
            background: isLiked ? "#22c55e22" : "#1e1e30", border: isLiked ? "1px solid #22c55e44" : "1px solid #2a2a3e",
            color: isLiked ? "#22c55e" : "#8888a0", borderRadius: 8, padding: "5px 12px",
            cursor: "pointer", fontSize: 13, transition: "all 0.2s",
          }}
        >👍{isLiked ? " Liked" : ""}</button>
        <button
          onClick={e => { e.stopPropagation(); onDislike(movie.id); }}
          style={{
            background: isDisliked ? "#ef444422" : "#1e1e30", border: isDisliked ? "1px solid #ef444444" : "1px solid #2a2a3e",
            color: isDisliked ? "#ef4444" : "#8888a0", borderRadius: 8, padding: "5px 12px",
            cursor: "pointer", fontSize: 13, transition: "all 0.2s",
          }}
        >👎{isDisliked ? " Nope" : ""}</button>
        <div style={{ marginLeft: "auto" }}>
          <StarRating value={rating || 0} onChange={r => onRate(movie.id, r)} size={16} />
        </div>
      </div>
    </div>
  );
};

// ─── MAIN APP ───
export default function MovieRecommender() {
  const [liked, setLiked] = useState(new Set());
  const [disliked, setDisliked] = useState(new Set());
  const [ratings, setRatings] = useState({});
  const [query, setQuery] = useState("");
  const [searchText, setSearchText] = useState("");
  const [recs, setRecs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [mode, setMode] = useState("content");
  const [loading, setLoading] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [tab, setTab] = useState("browse");
  const [feedback, setFeedback] = useState({});

  const tfidf = useMemo(() => buildTfIdf(MOVIES), []);

  const allGenres = useMemo(() => {
    const s = new Set();
    MOVIES.forEach(m => m.genre.forEach(g => s.add(g)));
    return [...s].sort();
  }, []);

  const browsableMovies = useMemo(() => {
    let list = MOVIES;
    if (searchText) {
      const q = searchText.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(q) || m.director.toLowerCase().includes(q) ||
        m.tags.some(t => t.includes(q)) || m.genre.some(g => g.toLowerCase().includes(q))
      );
    }
    if (selectedGenres.size > 0) {
      list = list.filter(m => m.genre.some(g => selectedGenres.has(g)));
    }
    return list;
  }, [searchText, selectedGenres]);

  const toggleLike = useCallback(id => {
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setDisliked(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, []);

  const toggleDislike = useCallback(id => {
    setDisliked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setLiked(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, []);

  const setRating = useCallback((id, r) => {
    setRatings(prev => ({ ...prev, [id]: r }));
  }, []);

  const handleFeedback = useCallback((movieId, type) => {
    setFeedback(prev => ({ ...prev, [movieId]: type }));
  }, []);

  const generateRecs = useCallback(async () => {
    setLoading(true);
    const likedArr = [...liked];
    const dislikedArr = [...disliked];
    let results = [];

    if (mode === "content") {
      results = getContentBasedRecs(likedArr, dislikedArr, ratings, MOVIES, tfidf, 12);
    } else if (mode === "nlp") {
      const excludeIds = [...likedArr, ...dislikedArr, ...Object.keys(ratings).map(Number)];
      results = getNLPRecs(query, MOVIES, tfidf, excludeIds, 12);
    } else if (mode === "llm") {
      const likedMovies = likedArr.map(id => MOVIES.find(m => m.id === id)).filter(Boolean);
      const dislikedMovies = dislikedArr.map(id => MOVIES.find(m => m.id === id)).filter(Boolean);
      const llmResults = await getLLMRecs(query, likedMovies, dislikedMovies, ratings, MOVIES);
      if (llmResults) {
        results = llmResults;
      } else {
        // fallback to content-based
        results = getContentBasedRecs(likedArr, dislikedArr, ratings, MOVIES, tfidf, 12);
      }
    }

    setRecs(results);
    setMetrics(computeMetrics(results, likedArr, MOVIES));
    setTab("recs");
    setLoading(false);
  }, [liked, disliked, ratings, query, mode, tfidf]);

  const hasInput = liked.size > 0 || disliked.size > 0 || Object.keys(ratings).length > 0 || query.length > 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a0a14 0%, #0e0e1a 40%, #12121e 100%)",
      color: "#e0e0f0", fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        .fade-up { animation: fadeUp 0.4s ease-out both; }
      `}</style>

      {/* HEADER */}
      <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid #1e1e30" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #22c55e, #3b82f6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18,
            }}>🎬</div>
            <h1 style={{
              margin: 0, fontSize: 22, fontWeight: 700,
              fontFamily: "'Newsreader', serif",
              background: "linear-gradient(90deg, #f0f0f8, #8888b0)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>CineMatch AI</h1>
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 6,
              background: "#22c55e18", color: "#22c55e", fontWeight: 600,
              letterSpacing: 0.5,
            }}>250 FILMS</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#6666a0", maxWidth: 500 }}>
            AI-powered movie recommendations with explainable matching. Like films, rate them, or describe what you want.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        {/* CONTROLS BAR */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100, padding: "16px 0",
          background: "linear-gradient(180deg, #0a0a14 85%, transparent)",
        }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {/* TAB TOGGLE */}
            <div style={{ display: "flex", background: "#1a1a2e", borderRadius: 10, padding: 3, gap: 2 }}>
              {[["browse", "Browse"], ["recs", `Recs${recs.length ? ` (${recs.length})` : ""}`], ["metrics", "Metrics"]].map(([k, label]) => (
                <button key={k} onClick={() => setTab(k)} style={{
                  padding: "6px 16px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 600, transition: "all 0.2s",
                  background: tab === k ? "#2a2a40" : "transparent",
                  color: tab === k ? "#f0f0f8" : "#6666a0",
                }}>{label}</button>
              ))}
            </div>

            {/* MODE SELECT */}
            <div style={{ display: "flex", background: "#1a1a2e", borderRadius: 10, padding: 3, gap: 2 }}>
              {[["content", "Content-Based"], ["nlp", "NLP Search"], ["llm", "LLM AI"]].map(([k, label]) => (
                <button key={k} onClick={() => setMode(k)} style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 600, transition: "all 0.2s",
                  background: mode === k ? (k === "llm" ? "#22c55e22" : "#3b82f622") : "transparent",
                  color: mode === k ? (k === "llm" ? "#22c55e" : "#3b82f6") : "#6666a0",
                }}>{label}</button>
              ))}
            </div>

            {/* STATUS BADGES */}
            <div style={{ display: "flex", gap: 6, marginLeft: "auto", alignItems: "center" }}>
              {liked.size > 0 && <span style={{ fontSize: 11, color: "#22c55e", padding: "3px 8px", background: "#22c55e11", borderRadius: 6 }}>👍 {liked.size}</span>}
              {disliked.size > 0 && <span style={{ fontSize: 11, color: "#ef4444", padding: "3px 8px", background: "#ef444411", borderRadius: 6 }}>👎 {disliked.size}</span>}
              {Object.keys(ratings).length > 0 && <span style={{ fontSize: 11, color: "#facc15", padding: "3px 8px", background: "#facc1511", borderRadius: 6 }}>★ {Object.keys(ratings).length} rated</span>}
            </div>
          </div>

          {/* NLP / LLM INPUT */}
          {(mode === "nlp" || mode === "llm") && tab !== "metrics" && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={mode === "llm" ? "Describe what you're in the mood for... (uses Claude AI)" : "Search by mood, theme, or description..."}
                  onKeyDown={e => { if (e.key === "Enter" && hasInput) generateRecs(); }}
                  style={{
                    flex: 1, padding: "10px 16px", borderRadius: 10, fontSize: 13,
                    border: "1px solid #2a2a3e", background: "#12121e", color: "#e0e0f0",
                    outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>
            </div>
          )}

          {/* GENERATE BUTTON */}
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={generateRecs}
              disabled={!hasInput || loading}
              style={{
                padding: "10px 28px", borderRadius: 10, border: "none", cursor: hasInput ? "pointer" : "not-allowed",
                fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
                background: hasInput
                  ? "linear-gradient(135deg, #22c55e, #16a34a)"
                  : "#2a2a3e",
                color: hasInput ? "#fff" : "#555",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s",
                boxShadow: hasInput ? "0 4px 20px #22c55e33" : "none",
              }}
            >
              {loading ? "⟳ Generating..." : `Get ${mode === "llm" ? "AI " : ""}Recommendations`}
            </button>
            {!hasInput && (
              <span style={{ fontSize: 12, color: "#55557a" }}>
                Like some movies, rate them, or type a description to get started
              </span>
            )}
          </div>
        </div>

        {/* BROWSE TAB */}
        {tab === "browse" && (
          <div className="fade-up">
            {/* GENRE FILTERS */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Filter movies..."
                style={{
                  padding: "6px 14px", borderRadius: 8, fontSize: 12,
                  border: "1px solid #2a2a3e", background: "#12121e", color: "#e0e0f0",
                  outline: "none", width: 180, fontFamily: "inherit",
                }}
              />
              {allGenres.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGenres(prev => {
                    const n = new Set(prev);
                    n.has(g) ? n.delete(g) : n.add(g);
                    return n;
                  })}
                  style={{
                    padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                    fontSize: 11, fontWeight: 500,
                    background: selectedGenres.has(g) ? "#3b82f633" : "#1a1a2e",
                    color: selectedGenres.has(g) ? "#60a5fa" : "#6666a0",
                    transition: "all 0.15s",
                  }}
                >{g}</button>
              ))}
            </div>

            <p style={{ fontSize: 12, color: "#55557a", marginBottom: 12 }}>
              Showing {browsableMovies.length} films — click to expand, like/dislike or rate to build your preference profile
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: 12,
            }}>
              {browsableMovies.map(m => (
                <MovieCard
                  key={m.id} movie={m}
                  onLike={toggleLike} onDislike={toggleDislike} onRate={setRating}
                  rating={ratings[m.id]} isLiked={liked.has(m.id)} isDisliked={disliked.has(m.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* RECS TAB */}
        {tab === "recs" && (
          <div className="fade-up">
            {recs.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, color: "#55557a" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                <p style={{ fontSize: 15 }}>No recommendations yet. Build your taste profile and hit generate!</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 13, color: "#6666a0", marginBottom: 16 }}>
                  {recs.length} personalized picks via <strong style={{ color: mode === "llm" ? "#22c55e" : "#3b82f6" }}>
                    {mode === "content" ? "Content-Based Filtering" : mode === "nlp" ? "NLP Semantic Search" : "Claude AI"}
                  </strong>
                  {mode === "content" && ` — analyzing TF-IDF embeddings across ${MOVIES.length} films`}
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: 12,
                }}>
                  {recs.map((r, i) => (
                    <div key={r.movie.id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                      <MovieCard
                        movie={r.movie} score={r.score}
                        explanation={r.explanation}
                        onLike={toggleLike} onDislike={toggleDislike} onRate={setRating}
                        rating={ratings[r.movie.id]} isLiked={liked.has(r.movie.id)} isDisliked={disliked.has(r.movie.id)}
                      />
                      {/* Feedback */}
                      <div style={{ display: "flex", gap: 6, marginTop: 6, justifyContent: "flex-end" }}>
                        <span style={{ fontSize: 11, color: "#55557a", marginRight: "auto" }}>Was this helpful?</span>
                        {["👍", "👎"].map(emoji => (
                          <button key={emoji} onClick={() => handleFeedback(r.movie.id, emoji)}
                            style={{
                              background: feedback[r.movie.id] === emoji ? "#2a2a40" : "transparent",
                              border: "1px solid #2a2a3e", borderRadius: 6, padding: "2px 8px",
                              cursor: "pointer", fontSize: 13,
                              opacity: feedback[r.movie.id] && feedback[r.movie.id] !== emoji ? 0.3 : 1,
                            }}>{emoji}</button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* METRICS TAB */}
        {tab === "metrics" && (
          <div className="fade-up" style={{ maxWidth: 560 }}>
            <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: 20, marginBottom: 4 }}>Evaluation Metrics</h2>
            <p style={{ fontSize: 12, color: "#55557a", marginBottom: 24 }}>
              Measuring recommendation quality across accuracy, diversity, and coverage dimensions
            </p>

            {metrics ? (
              <div style={{ background: "#16162a", borderRadius: 14, padding: 24, border: "1px solid #2a2a3e" }}>
                <MetricBar label="Precision@5 (genre relevance)" value={metrics.precisionAt5} color="#22c55e" />
                <MetricBar label="NDCG (ranking quality)" value={metrics.ndcg} color="#3b82f6" />
                <MetricBar label="Intra-list Diversity" value={metrics.diversityScore} color="#a855f7" />
                <MetricBar label="Genre Coverage" value={metrics.coverageScore} color="#f97316" />
                <MetricBar label="Avg Similarity Score" value={metrics.avgScore} color="#06b6d4" />

                <div style={{ marginTop: 20, padding: 16, background: "#1a1a30", borderRadius: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#8888a0", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>
                    Feedback Signals
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#22c55e", fontFamily: "'JetBrains Mono', monospace" }}>
                        {Object.values(feedback).filter(f => f === "👍").length}
                      </div>
                      <div style={{ fontSize: 11, color: "#6666a0" }}>Positive</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#ef4444", fontFamily: "'JetBrains Mono', monospace" }}>
                        {Object.values(feedback).filter(f => f === "👎").length}
                      </div>
                      <div style={{ fontSize: 11, color: "#6666a0" }}>Negative</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#f0f0f8", fontFamily: "'JetBrains Mono', monospace" }}>
                        {Object.values(feedback).length > 0
                          ? ((Object.values(feedback).filter(f => f === "👍").length / Object.values(feedback).length) * 100).toFixed(0) + "%"
                          : "—"}
                      </div>
                      <div style={{ fontSize: 11, color: "#6666a0" }}>Like Ratio</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#55557a", background: "#16162a", borderRadius: 14 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
                <p>Generate recommendations first to see evaluation metrics</p>
              </div>
            )}

            <div style={{ marginTop: 20, padding: 16, background: "#16162a", borderRadius: 14, border: "1px solid #2a2a3e" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#8888a0", marginBottom: 10, letterSpacing: 1, textTransform: "uppercase" }}>
                System Configuration
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
                <div style={{ color: "#6666a0" }}>Dataset</div><div style={{ color: "#c0c0d0" }}>250 movies (1927–2024)</div>
                <div style={{ color: "#6666a0" }}>Embedding</div><div style={{ color: "#c0c0d0" }}>TF-IDF (title + desc + meta)</div>
                <div style={{ color: "#6666a0" }}>Similarity</div><div style={{ color: "#c0c0d0" }}>Cosine similarity</div>
                <div style={{ color: "#6666a0" }}>Approaches</div><div style={{ color: "#c0c0d0" }}>Content-based, NLP, LLM</div>
                <div style={{ color: "#6666a0" }}>Input Methods</div><div style={{ color: "#c0c0d0" }}>Like/dislike, ratings, NL query, genre select</div>
                <div style={{ color: "#6666a0" }}>Metrics</div><div style={{ color: "#c0c0d0" }}>Precision@K, NDCG, Diversity, Coverage, CTR</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ height: 60 }} />
      </div>
    </div>
  );
}
