"""
CineMatch AI — Movie Recommendation System
============================================
AI-powered movie recommendations with explanation generation,
multiple recommendation approaches, and evaluation metrics.

Requirements: pip install streamlit scikit-learn numpy pandas anthropic
Run: streamlit run app.py
"""

import streamlit as st
import numpy as np
import pandas as pd
import json
import math
import os
from collections import Counter, defaultdict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ─────────────────────────────────────────────
# MOVIE DATASET (250 items)
# ─────────────────────────────────────────────
MOVIES_RAW = [
    {"id":1,"title":"The Shawshank Redemption","year":1994,"genre":["Drama"],"director":"Frank Darabont","rating":9.3,"desc":"A banker convicted of uxoricide forms a transformative friendship with a fellow prisoner as they find solace and eventual redemption through acts of common decency.","tags":["prison","friendship","hope","escape"],"mood":"inspiring"},
    {"id":2,"title":"The Godfather","year":1972,"genre":["Crime","Drama"],"director":"Francis Ford Coppola","rating":9.2,"desc":"The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.","tags":["mafia","family","power","loyalty"],"mood":"intense"},
    {"id":3,"title":"The Dark Knight","year":2008,"genre":["Action","Crime","Drama"],"director":"Christopher Nolan","rating":9.0,"desc":"When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.","tags":["superhero","villain","chaos","justice"],"mood":"thrilling"},
    {"id":4,"title":"Pulp Fiction","year":1994,"genre":["Crime","Drama"],"director":"Quentin Tarantino","rating":8.9,"desc":"The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.","tags":["nonlinear","dialogue","crime","dark-humor"],"mood":"edgy"},
    {"id":5,"title":"Schindler's List","year":1993,"genre":["Biography","Drama","History"],"director":"Steven Spielberg","rating":9.0,"desc":"In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.","tags":["holocaust","heroism","war","humanity"],"mood":"emotional"},
    {"id":6,"title":"The Lord of the Rings: The Return of the King","year":2003,"genre":["Action","Adventure","Drama"],"director":"Peter Jackson","rating":9.0,"desc":"Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom.","tags":["fantasy","quest","epic","friendship"],"mood":"epic"},
    {"id":7,"title":"Fight Club","year":1999,"genre":["Drama"],"director":"David Fincher","rating":8.8,"desc":"An insomniac office worker and a soap salesman build a global organization to help vent male aggression.","tags":["identity","rebellion","twist","consumerism"],"mood":"edgy"},
    {"id":8,"title":"Forrest Gump","year":1994,"genre":["Drama","Romance"],"director":"Robert Zemeckis","rating":8.8,"desc":"The presidencies of Kennedy and Johnson through Vietnam and beyond through the eyes of an Alabama man with an IQ of 75.","tags":["history","innocence","love","journey"],"mood":"heartwarming"},
    {"id":9,"title":"Inception","year":2010,"genre":["Action","Adventure","Sci-Fi"],"director":"Christopher Nolan","rating":8.8,"desc":"A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.","tags":["dreams","heist","mind-bending","layers"],"mood":"thrilling"},
    {"id":10,"title":"The Matrix","year":1999,"genre":["Action","Sci-Fi"],"director":"Lana Wachowski","rating":8.7,"desc":"When a hacker discovers that reality is a simulation, he joins a rebellion against machine overlords.","tags":["simulation","chosen-one","philosophy","cyberpunk"],"mood":"thrilling"},
    {"id":11,"title":"Goodfellas","year":1990,"genre":["Biography","Crime","Drama"],"director":"Martin Scorsese","rating":8.7,"desc":"The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen and his mob partners.","tags":["mafia","rise-and-fall","crime","loyalty"],"mood":"intense"},
    {"id":12,"title":"Interstellar","year":2014,"genre":["Adventure","Drama","Sci-Fi"],"director":"Christopher Nolan","rating":8.7,"desc":"A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.","tags":["space","time","love","science"],"mood":"epic"},
    {"id":13,"title":"City of God","year":2002,"genre":["Crime","Drama"],"director":"Fernando Meirelles","rating":8.6,"desc":"In the slums of Rio, two kids paths diverge as one struggles to become a photographer and the other a kingpin.","tags":["poverty","violence","coming-of-age","brazil"],"mood":"intense"},
    {"id":14,"title":"Spirited Away","year":2001,"genre":["Animation","Adventure","Family"],"director":"Hayao Miyazaki","rating":8.6,"desc":"During her family's move, a young girl enters a world ruled by gods, witches, and spirits where humans are changed into beasts.","tags":["anime","magical","coming-of-age","japanese"],"mood":"whimsical"},
    {"id":15,"title":"Saving Private Ryan","year":1998,"genre":["Drama","War"],"director":"Steven Spielberg","rating":8.6,"desc":"Following the Normandy Landings, a group of soldiers goes behind enemy lines to retrieve a paratrooper whose brothers have been killed.","tags":["war","sacrifice","brotherhood","ww2"],"mood":"intense"},
    {"id":16,"title":"The Silence of the Lambs","year":1991,"genre":["Crime","Drama","Thriller"],"director":"Jonathan Demme","rating":8.6,"desc":"A young FBI cadet must receive the help of an incarcerated manipulative cannibal to catch another serial killer.","tags":["serial-killer","psychological","cat-and-mouse","thriller"],"mood":"suspenseful"},
    {"id":17,"title":"Se7en","year":1995,"genre":["Crime","Drama","Mystery"],"director":"David Fincher","rating":8.6,"desc":"Two detectives hunt a serial killer who uses the seven deadly sins as his motives.","tags":["serial-killer","dark","mystery","twist"],"mood":"dark"},
    {"id":18,"title":"The Green Mile","year":1999,"genre":["Crime","Drama","Fantasy"],"director":"Frank Darabont","rating":8.6,"desc":"The lives of guards on Death Row are affected by one of their charges: a man accused of child murder who has a mysterious gift.","tags":["prison","supernatural","justice","emotion"],"mood":"emotional"},
    {"id":19,"title":"Parasite","year":2019,"genre":["Comedy","Drama","Thriller"],"director":"Bong Joon-ho","rating":8.5,"desc":"Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.","tags":["class","twist","social-commentary","korean"],"mood":"suspenseful"},
    {"id":20,"title":"Gladiator","year":2000,"genre":["Action","Adventure","Drama"],"director":"Ridley Scott","rating":8.5,"desc":"A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.","tags":["revenge","roman","arena","honor"],"mood":"epic"},
    {"id":21,"title":"The Departed","year":2006,"genre":["Crime","Drama","Thriller"],"director":"Martin Scorsese","rating":8.5,"desc":"An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.","tags":["undercover","identity","boston","betrayal"],"mood":"intense"},
    {"id":22,"title":"Whiplash","year":2014,"genre":["Drama","Music"],"director":"Damien Chazelle","rating":8.5,"desc":"A promising young drummer enrolls at a music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.","tags":["music","obsession","mentorship","perfection"],"mood":"intense"},
    {"id":23,"title":"The Prestige","year":2006,"genre":["Drama","Mystery","Sci-Fi"],"director":"Christopher Nolan","rating":8.5,"desc":"Two rival magicians engage in a bitter battle for supremacy, each trying to outdo the other with increasingly dangerous tricks.","tags":["magic","rivalry","twist","obsession"],"mood":"suspenseful"},
    {"id":24,"title":"Django Unchained","year":2012,"genre":["Drama","Western"],"director":"Quentin Tarantino","rating":8.5,"desc":"With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal plantation owner.","tags":["slavery","revenge","western","dark-humor"],"mood":"edgy"},
    {"id":25,"title":"The Lion King","year":1994,"genre":["Animation","Adventure","Drama"],"director":"Roger Allers","rating":8.5,"desc":"Lion prince Simba flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery.","tags":["animation","coming-of-age","family","africa"],"mood":"heartwarming"},
    {"id":26,"title":"Alien","year":1979,"genre":["Horror","Sci-Fi"],"director":"Ridley Scott","rating":8.5,"desc":"The crew of a commercial spacecraft encounters a deadly lifeform after investigating an unknown transmission.","tags":["space","horror","survival","creature"],"mood":"suspenseful"},
    {"id":27,"title":"WALL-E","year":2008,"genre":["Animation","Adventure","Family"],"director":"Andrew Stanton","rating":8.4,"desc":"In the distant future a small waste-collecting robot inadvertently embarks on a space journey that decides the fate of mankind.","tags":["robot","love","environment","animation"],"mood":"heartwarming"},
    {"id":28,"title":"Memento","year":2000,"genre":["Mystery","Thriller"],"director":"Christopher Nolan","rating":8.4,"desc":"A man with short-term memory loss attempts to track down the murderer of his wife using notes and tattoos.","tags":["memory","nonlinear","mystery","identity"],"mood":"suspenseful"},
    {"id":29,"title":"Eternal Sunshine of the Spotless Mind","year":2004,"genre":["Drama","Romance","Sci-Fi"],"director":"Michel Gondry","rating":8.3,"desc":"When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.","tags":["memory","love","loss","surreal"],"mood":"melancholy"},
    {"id":30,"title":"Amélie","year":2001,"genre":["Comedy","Romance"],"director":"Jean-Pierre Jeunet","rating":8.3,"desc":"A shy waitress decides to change the lives of those around her for the better while struggling with her own isolation.","tags":["paris","whimsical","love","kindness"],"mood":"whimsical"},
    {"id":31,"title":"The Truman Show","year":1998,"genre":["Comedy","Drama"],"director":"Peter Weir","rating":8.2,"desc":"An insurance salesman discovers his whole life is actually a reality TV show.","tags":["reality","freedom","media","identity"],"mood":"thought-provoking"},
    {"id":32,"title":"No Country for Old Men","year":2007,"genre":["Crime","Drama","Thriller"],"director":"Coen Brothers","rating":8.2,"desc":"Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash.","tags":["fate","violence","cat-and-mouse","western"],"mood":"dark"},
    {"id":33,"title":"Blade Runner 2049","year":2017,"genre":["Action","Drama","Mystery"],"director":"Denis Villeneuve","rating":8.0,"desc":"Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.","tags":["cyberpunk","identity","dystopia","ai"],"mood":"melancholy"},
    {"id":34,"title":"Mad Max: Fury Road","year":2015,"genre":["Action","Adventure","Sci-Fi"],"director":"George Miller","rating":8.1,"desc":"In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland.","tags":["post-apocalyptic","chase","feminist","action"],"mood":"thrilling"},
    {"id":35,"title":"The Grand Budapest Hotel","year":2014,"genre":["Adventure","Comedy","Crime"],"director":"Wes Anderson","rating":8.1,"desc":"A writer encounters the owner of an aging luxury hotel, who tells him of his early years serving as lobby boy to a legendary concierge.","tags":["quirky","visual","comedy","europe"],"mood":"whimsical"},
    {"id":36,"title":"The Shining","year":1980,"genre":["Drama","Horror"],"director":"Stanley Kubrick","rating":8.4,"desc":"A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.","tags":["horror","isolation","madness","supernatural"],"mood":"dark"},
    {"id":37,"title":"Jurassic Park","year":1993,"genre":["Action","Adventure","Sci-Fi"],"director":"Steven Spielberg","rating":8.2,"desc":"A pragmatic paleontologist touring an almost complete theme park is tasked with protecting a couple of kids after dinosaurs break free.","tags":["dinosaurs","science","theme-park","survival"],"mood":"thrilling"},
    {"id":38,"title":"Back to the Future","year":1985,"genre":["Adventure","Comedy","Sci-Fi"],"director":"Robert Zemeckis","rating":8.5,"desc":"Marty McFly, a typical American teenager of the '80s, accidentally travels back in time to 1955.","tags":["time-travel","comedy","80s","adventure"],"mood":"fun"},
    {"id":39,"title":"The Social Network","year":2010,"genre":["Biography","Drama"],"director":"David Fincher","rating":7.8,"desc":"As Harvard student Mark Zuckerberg creates the social networking site that becomes Facebook, he is sued by two brothers who claim he stole their idea.","tags":["tech","ambition","betrayal","startup"],"mood":"intense"},
    {"id":40,"title":"Her","year":2013,"genre":["Drama","Romance","Sci-Fi"],"director":"Spike Jonze","rating":8.0,"desc":"In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.","tags":["ai","love","loneliness","future"],"mood":"melancholy"},
    {"id":41,"title":"2001: A Space Odyssey","year":1968,"genre":["Adventure","Sci-Fi"],"director":"Stanley Kubrick","rating":8.3,"desc":"After discovering a mysterious artifact buried beneath the Lunar surface, mankind sets off on a quest to find its origins with the help of intelligent supercomputer HAL 9000.","tags":["space","ai","evolution","philosophical"],"mood":"thought-provoking"},
    {"id":42,"title":"Oldboy","year":2003,"genre":["Action","Drama","Mystery"],"director":"Park Chan-wook","rating":8.4,"desc":"After being kidnapped and imprisoned for fifteen years, a man is released and sets out to find the reason for his incarceration.","tags":["revenge","twist","korean","psychological"],"mood":"dark"},
    {"id":43,"title":"Arrival","year":2016,"genre":["Drama","Mystery","Sci-Fi"],"director":"Denis Villeneuve","rating":7.9,"desc":"A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.","tags":["aliens","language","time","communication"],"mood":"thought-provoking"},
    {"id":44,"title":"The Thing","year":1982,"genre":["Horror","Mystery","Sci-Fi"],"director":"John Carpenter","rating":8.2,"desc":"A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims.","tags":["alien","paranoia","horror","isolation"],"mood":"suspenseful"},
    {"id":45,"title":"Taxi Driver","year":1976,"genre":["Crime","Drama"],"director":"Martin Scorsese","rating":8.2,"desc":"A mentally unstable veteran works as a nighttime taxi driver in New York City, where the perceived decadence and sleaze fuels his urge for violent action.","tags":["isolation","madness","new-york","vigilante"],"mood":"dark"},
    {"id":46,"title":"Everything Everywhere All at Once","year":2022,"genre":["Action","Adventure","Comedy"],"director":"Daniel Kwan","rating":7.8,"desc":"A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.","tags":["multiverse","family","absurd","existential"],"mood":"emotional"},
    {"id":47,"title":"Moonlight","year":2016,"genre":["Drama"],"director":"Barry Jenkins","rating":7.4,"desc":"A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and bursting adulthood.","tags":["identity","coming-of-age","poverty","love"],"mood":"emotional"},
    {"id":48,"title":"Get Out","year":2017,"genre":["Horror","Mystery","Thriller"],"director":"Jordan Peele","rating":7.7,"desc":"A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.","tags":["race","horror","social-commentary","twist"],"mood":"suspenseful"},
    {"id":49,"title":"La La Land","year":2016,"genre":["Comedy","Drama","Music"],"director":"Damien Chazelle","rating":8.0,"desc":"While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.","tags":["music","love","dreams","los-angeles"],"mood":"bittersweet"},
    {"id":50,"title":"The Revenant","year":2015,"genre":["Action","Adventure","Drama"],"director":"Alejandro Iñárritu","rating":8.0,"desc":"A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear and left for dead.","tags":["survival","revenge","nature","frontier"],"mood":"intense"},
    {"id":51,"title":"A Clockwork Orange","year":1971,"genre":["Crime","Drama","Sci-Fi"],"director":"Stanley Kubrick","rating":8.3,"desc":"In a dystopian future, a charismatic delinquent is jailed and volunteers for an experimental aversion therapy developed by the government.","tags":["dystopia","violence","free-will","satire"],"mood":"dark"},
    {"id":52,"title":"Rear Window","year":1954,"genre":["Mystery","Thriller"],"director":"Alfred Hitchcock","rating":8.5,"desc":"A photographer confined to his apartment due to a broken leg becomes convinced that a neighbor has committed murder.","tags":["voyeurism","suspense","classic","mystery"],"mood":"suspenseful"},
    {"id":53,"title":"The Sixth Sense","year":1999,"genre":["Drama","Mystery","Thriller"],"director":"M. Night Shyamalan","rating":8.2,"desc":"A boy who communicates with spirits seeks the help of a disheartened child psychologist.","tags":["supernatural","twist","ghost","child"],"mood":"suspenseful"},
    {"id":54,"title":"Inside Out","year":2015,"genre":["Animation","Adventure","Comedy"],"director":"Pete Docter","rating":8.1,"desc":"After young Riley is uprooted from her life in the Midwest, her emotions conflict on how best to navigate a new city, house, and school.","tags":["emotions","animation","family","growing-up"],"mood":"heartwarming"},
    {"id":55,"title":"Jaws","year":1975,"genre":["Adventure","Thriller"],"director":"Steven Spielberg","rating":8.1,"desc":"A police chief, marine scientist and fisherman try to stop a great white shark that is terrorizing a beach community.","tags":["shark","summer","survival","suspense"],"mood":"thrilling"},
    {"id":56,"title":"Pan's Labyrinth","year":2006,"genre":["Drama","Fantasy","War"],"director":"Guillermo del Toro","rating":8.2,"desc":"In post-Civil War Spain, a girl is drawn into a fantastical world of mythical creatures and dangerous quests as reality and fantasy intertwine.","tags":["fantasy","war","dark-fairy-tale","spanish"],"mood":"dark"},
    {"id":57,"title":"There Will Be Blood","year":2007,"genre":["Drama"],"director":"Paul Thomas Anderson","rating":8.2,"desc":"A misanthropic oil prospector's ruthless quest for wealth leads to conflict with a charismatic preacher in early 20th-century California.","tags":["ambition","greed","religion","americana"],"mood":"intense"},
    {"id":58,"title":"Coco","year":2017,"genre":["Animation","Adventure","Comedy"],"director":"Lee Unkrich","rating":8.4,"desc":"Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer.","tags":["music","family","mexican","death","animation"],"mood":"heartwarming"},
    {"id":59,"title":"The Usual Suspects","year":1995,"genre":["Crime","Drama","Mystery"],"director":"Bryan Singer","rating":8.5,"desc":"A sole survivor tells the twisted events leading up to a horrific gun battle on a boat.","tags":["twist","unreliable-narrator","crime","mystery"],"mood":"suspenseful"},
    {"id":60,"title":"Gone Girl","year":2014,"genre":["Drama","Mystery","Thriller"],"director":"David Fincher","rating":8.1,"desc":"With his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him.","tags":["marriage","media","twist","psychological"],"mood":"dark"},
    {"id":61,"title":"Up","year":2009,"genre":["Animation","Adventure","Comedy"],"director":"Pete Docter","rating":8.3,"desc":"By tying thousands of balloons to his house, an elderly widower and a young scout set off to fulfill a lifelong dream.","tags":["adventure","animation","grief","friendship"],"mood":"heartwarming"},
    {"id":62,"title":"Kill Bill: Vol. 1","year":2003,"genre":["Action","Crime","Drama"],"director":"Quentin Tarantino","rating":8.2,"desc":"After awakening from a coma, a former assassin wreaks vengeance on the team of assassins who betrayed her.","tags":["revenge","martial-arts","stylized","action"],"mood":"thrilling"},
    {"id":63,"title":"Dune","year":2021,"genre":["Action","Adventure","Drama"],"director":"Denis Villeneuve","rating":8.0,"desc":"A noble family becomes embroiled in a war for control over the galaxy's most valuable asset, the desert planet Arrakis.","tags":["sci-fi","desert","politics","epic"],"mood":"epic"},
    {"id":64,"title":"The Terminator","year":1984,"genre":["Action","Sci-Fi"],"director":"James Cameron","rating":8.1,"desc":"A human soldier is sent from 2029 to 1984 to stop a cyborg killing machine sent from the same year to kill a woman whose unborn son will lead humanity.","tags":["time-travel","robot","chase","dystopia"],"mood":"thrilling"},
    {"id":65,"title":"Groundhog Day","year":1993,"genre":["Comedy","Drama","Fantasy"],"director":"Harold Ramis","rating":8.1,"desc":"A self-centered weatherman finds himself reliving the same day over and over again until he learns to become a better person.","tags":["time-loop","comedy","redemption","romance"],"mood":"fun"},
    {"id":66,"title":"12 Angry Men","year":1957,"genre":["Crime","Drama"],"director":"Sidney Lumet","rating":9.0,"desc":"The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence.","tags":["justice","debate","classic","dialogue"],"mood":"thought-provoking"},
    {"id":67,"title":"Life Is Beautiful","year":1997,"genre":["Comedy","Drama","Romance"],"director":"Roberto Benigni","rating":8.6,"desc":"A Jewish Italian waiter uses humor and imagination to shield his young son from the horrors of a Nazi internment camp.","tags":["holocaust","comedy","family","italian"],"mood":"emotional"},
    {"id":68,"title":"The Pianist","year":2002,"genre":["Biography","Drama","Music"],"director":"Roman Polanski","rating":8.5,"desc":"A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto during World War II.","tags":["war","music","survival","holocaust"],"mood":"emotional"},
    {"id":69,"title":"Toy Story","year":1995,"genre":["Animation","Adventure","Comedy"],"director":"John Lasseter","rating":8.3,"desc":"A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy.","tags":["animation","friendship","toys","pixar"],"mood":"fun"},
    {"id":70,"title":"Blade Runner","year":1982,"genre":["Action","Drama","Sci-Fi"],"director":"Ridley Scott","rating":8.1,"desc":"A blade runner must pursue and terminate four replicants who have escaped to Earth seeking their creator.","tags":["cyberpunk","ai","dystopia","identity"],"mood":"melancholy"},
    {"id":71,"title":"Good Will Hunting","year":1997,"genre":["Drama","Romance"],"director":"Gus Van Sant","rating":8.3,"desc":"Will Hunting, a janitor at MIT has a gift for mathematics but needs help from a psychologist to find direction in his life.","tags":["genius","therapy","boston","coming-of-age"],"mood":"heartwarming"},
    {"id":72,"title":"Ratatouille","year":2007,"genre":["Animation","Comedy","Family"],"director":"Brad Bird","rating":8.1,"desc":"A rat who can cook makes an unusual alliance with a young kitchen worker at a famous Paris restaurant.","tags":["cooking","paris","animation","dreams"],"mood":"whimsical"},
    {"id":73,"title":"The Exorcist","year":1973,"genre":["Horror"],"director":"William Friedkin","rating":8.1,"desc":"When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.","tags":["possession","horror","religion","classic"],"mood":"dark"},
    {"id":74,"title":"A Beautiful Mind","year":2001,"genre":["Biography","Drama"],"director":"Ron Howard","rating":8.2,"desc":"After John Nash accepts secret work in cryptography, his life takes a turn for the nightmarish.","tags":["genius","mental-health","mathematics","biography"],"mood":"inspiring"},
    {"id":75,"title":"Joker","year":2019,"genre":["Crime","Drama","Thriller"],"director":"Todd Phillips","rating":8.4,"desc":"During the 1980s, a failed comedian is driven insane and turns to a life of crime and chaos in Gotham City.","tags":["villain-origin","mental-health","society","transformation"],"mood":"dark"},
    {"id":76,"title":"The Princess Bride","year":1987,"genre":["Adventure","Comedy","Family"],"director":"Rob Reiner","rating":8.0,"desc":"A young woman is kidnapped and a farmhand-turned-pirate sets out to rescue her in a fairy tale adventure.","tags":["fairy-tale","comedy","romance","adventure"],"mood":"fun"},
    {"id":77,"title":"District 9","year":2009,"genre":["Action","Sci-Fi","Thriller"],"director":"Neill Blomkamp","rating":7.9,"desc":"Aliens land in South Africa and are forced to live in slum-like conditions. A government agent becomes exposed to their technology.","tags":["aliens","apartheid","south-africa","social-commentary"],"mood":"intense"},
    {"id":78,"title":"The Big Lebowski","year":1998,"genre":["Comedy","Crime"],"director":"Coen Brothers","rating":8.1,"desc":"Jeff The Dude Lebowski, mistaken for a millionaire of the same name, seeks restitution for his ruined rug.","tags":["comedy","absurd","bowling","noir"],"mood":"fun"},
    {"id":79,"title":"Children of Men","year":2006,"genre":["Action","Drama","Sci-Fi"],"director":"Alfonso Cuarón","rating":7.9,"desc":"In a chaotic world in which women have become infertile, a former activist reluctantly agrees to help transport a miraculously pregnant woman.","tags":["dystopia","hope","fertility","refugee"],"mood":"intense"},
    {"id":80,"title":"Requiem for a Dream","year":2000,"genre":["Drama"],"director":"Darren Aronofsky","rating":8.3,"desc":"The drug-induced utopias of four Coney Island people are shattered when their addictions run deep.","tags":["addiction","spiral","dark","psychological"],"mood":"dark"},
    {"id":81,"title":"Hunt for the Wilderpeople","year":2016,"genre":["Adventure","Comedy","Drama"],"director":"Taika Waititi","rating":7.9,"desc":"A national manhunt is ordered for a rebellious kid and his foster uncle who go missing in the New Zealand bush.","tags":["adventure","comedy","new-zealand","coming-of-age"],"mood":"fun"},
    {"id":82,"title":"The Witch","year":2015,"genre":["Drama","Fantasy","Horror"],"director":"Robert Eggers","rating":6.9,"desc":"A family in 1630s New England is torn apart by the forces of witchcraft, black magic, and possession.","tags":["folk-horror","puritan","isolation","slow-burn"],"mood":"dark"},
    {"id":83,"title":"Portrait of a Lady on Fire","year":2019,"genre":["Drama","Romance"],"director":"Céline Sciamma","rating":7.5,"desc":"On an isolated island, a female painter is commissioned to paint the wedding portrait of a young woman.","tags":["love","art","french","period-piece"],"mood":"melancholy"},
    {"id":84,"title":"The Lighthouse","year":2019,"genre":["Drama","Fantasy","Horror"],"director":"Robert Eggers","rating":7.4,"desc":"Two lighthouse keepers try to maintain their sanity while living on a remote island in the 1890s.","tags":["madness","isolation","mythology","black-and-white"],"mood":"dark"},
    {"id":85,"title":"Nightcrawler","year":2014,"genre":["Crime","Drama","Thriller"],"director":"Dan Gilroy","rating":7.9,"desc":"A driven young man stumbles upon nighttime crime journalism in Los Angeles, blurring the line between observer and participant.","tags":["media","sociopath","los-angeles","ambition"],"mood":"dark"},
    {"id":86,"title":"Dunkirk","year":2017,"genre":["Action","Drama","History"],"director":"Christopher Nolan","rating":7.8,"desc":"Allied soldiers from Belgium and France are surrounded by the German army and evacuated during a fierce battle.","tags":["war","survival","ww2","suspense"],"mood":"intense"},
    {"id":87,"title":"1917","year":2019,"genre":["Drama","War"],"director":"Sam Mendes","rating":8.3,"desc":"Two young British privates are given the seemingly impossible mission to deliver a message that will stop 1,600 men from walking into a trap.","tags":["war","one-shot","ww1","mission"],"mood":"intense"},
    {"id":88,"title":"Drive","year":2011,"genre":["Action","Drama"],"director":"Nicolas Winding Refn","rating":7.8,"desc":"A mysterious Hollywood stuntman and getaway driver lands himself in trouble when he helps out his neighbor.","tags":["neo-noir","violence","stylized","quiet"],"mood":"dark"},
    {"id":89,"title":"Zodiac","year":2007,"genre":["Crime","Drama","Mystery"],"director":"David Fincher","rating":7.7,"desc":"Between 1968 and 1983, a cartoonist becomes obsessed with tracking down the Zodiac killer.","tags":["serial-killer","obsession","journalism","unsolved"],"mood":"suspenseful"},
    {"id":90,"title":"Ex Machina","year":2014,"genre":["Drama","Mystery","Sci-Fi"],"director":"Alex Garland","rating":7.7,"desc":"A young programmer is selected to participate in a groundbreaking experiment to evaluate the human qualities of a highly advanced humanoid AI.","tags":["ai","consciousness","isolation","manipulation"],"mood":"suspenseful"},
    {"id":91,"title":"The Farewell","year":2019,"genre":["Comedy","Drama"],"director":"Lulu Wang","rating":7.5,"desc":"A Chinese family discovers their grandmother has only a short while left to live and decide to keep her in the dark.","tags":["family","chinese","cultural","grief"],"mood":"emotional"},
    {"id":92,"title":"Sicario","year":2015,"genre":["Action","Crime","Drama"],"director":"Denis Villeneuve","rating":7.6,"desc":"An idealistic FBI agent is enlisted by a government task force to aid in the escalating war against drugs at the border area between the U.S. and Mexico.","tags":["cartel","border","moral-ambiguity","thriller"],"mood":"intense"},
    {"id":93,"title":"The Handmaiden","year":2016,"genre":["Crime","Drama","Romance"],"director":"Park Chan-wook","rating":8.1,"desc":"A woman is hired as a handmaiden to a Japanese heiress, but secretly she is involved in a plot to defraud her.","tags":["twist","romance","korean","con"],"mood":"suspenseful"},
    {"id":94,"title":"Predator","year":1987,"genre":["Action","Adventure","Horror"],"director":"John McTiernan","rating":7.8,"desc":"A team of commandos on a mission in a Central American jungle find themselves hunted by an extraterrestrial warrior.","tags":["alien","jungle","action","survival"],"mood":"thrilling"},
    {"id":95,"title":"Annihilation","year":2018,"genre":["Adventure","Drama","Horror"],"director":"Alex Garland","rating":6.8,"desc":"A biologist signs up for a dangerous expedition into a mysterious zone where the laws of nature don't apply.","tags":["mutation","mystery","science","psychological"],"mood":"thought-provoking"},
    {"id":96,"title":"Your Name","year":2016,"genre":["Animation","Drama","Fantasy"],"director":"Makoto Shinkai","rating":8.4,"desc":"Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?","tags":["anime","body-swap","love","japanese"],"mood":"emotional"},
    {"id":97,"title":"The Incredibles","year":2004,"genre":["Animation","Action","Adventure"],"director":"Brad Bird","rating":8.0,"desc":"A family of undercover superheroes tries to live the quiet suburban life, but is forced into action to save the world.","tags":["superhero","family","animation","action"],"mood":"fun"},
    {"id":98,"title":"Prisoners","year":2013,"genre":["Crime","Drama","Mystery"],"director":"Denis Villeneuve","rating":8.1,"desc":"When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads.","tags":["kidnapping","moral-ambiguity","dark","suspense"],"mood":"dark"},
    {"id":99,"title":"The Batman","year":2022,"genre":["Action","Crime","Drama"],"director":"Matt Reeves","rating":7.8,"desc":"When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.","tags":["superhero","noir","detective","dark"],"mood":"dark"},
    {"id":100,"title":"Hereditary","year":2018,"genre":["Drama","Horror","Mystery"],"director":"Ari Aster","rating":7.3,"desc":"A grieving family is haunted by tragic and disturbing occurrences after the death of their secretive grandmother.","tags":["horror","grief","family","cult"],"mood":"dark"},
    {"id":101,"title":"Roma","year":2018,"genre":["Drama"],"director":"Alfonso Cuarón","rating":7.7,"desc":"A year in the life of a middle-class family's maid in Mexico City in the early 1970s.","tags":["mexico","class","memory","personal"],"mood":"melancholy"},
    {"id":102,"title":"Midsommar","year":2019,"genre":["Drama","Horror","Mystery"],"director":"Ari Aster","rating":7.1,"desc":"A couple travels to Northern Europe to visit a rural hometown's fabled Swedish midsummer festival only to find themselves in a nightmarish pagan ritual.","tags":["folk-horror","relationship","cult","daylight-horror"],"mood":"dark"},
    {"id":103,"title":"Knives Out","year":2019,"genre":["Comedy","Crime","Drama"],"director":"Rian Johnson","rating":7.9,"desc":"A detective investigates the death of a patriarch of an eccentric, combative family.","tags":["whodunit","comedy","mystery","ensemble"],"mood":"fun"},
    {"id":104,"title":"Oppenheimer","year":2023,"genre":["Biography","Drama","History"],"director":"Christopher Nolan","rating":8.3,"desc":"The story of theoretical physicist J. Robert Oppenheimer and his role in the development of the atomic bomb.","tags":["nuclear","biography","war","science"],"mood":"intense"},
    {"id":105,"title":"Spider-Man: Into the Spider-Verse","year":2018,"genre":["Animation","Action","Adventure"],"director":"Bob Persichetti","rating":8.4,"desc":"Teen Miles Morales becomes the Spider-Man of his universe and must cross dimensions to stop a threat to all realities.","tags":["animation","superhero","multiverse","stylized"],"mood":"fun"},
    {"id":106,"title":"Alien: Romulus","year":2024,"genre":["Horror","Sci-Fi","Thriller"],"director":"Fede Alvarez","rating":7.2,"desc":"Young space colonizers scavenge a derelict station and encounter the most terrifying life form in the universe.","tags":["space","horror","survival","alien"],"mood":"suspenseful"},
    {"id":107,"title":"Little Women","year":2019,"genre":["Drama","Romance"],"director":"Greta Gerwig","rating":7.8,"desc":"Jo March reflects on her life, telling the beloved story of the March sisters – four young women each determined to live life on her own terms.","tags":["period-piece","sisterhood","feminist","literary"],"mood":"heartwarming"},
    {"id":108,"title":"Fargo","year":1996,"genre":["Crime","Thriller"],"director":"Coen Brothers","rating":8.1,"desc":"A car salesman hires two criminals to kidnap his wife, but the plan goes terribly wrong when a pregnant police chief starts investigating.","tags":["dark-humor","crime","midwest","quirky"],"mood":"dark"},
    {"id":109,"title":"Once Upon a Time in Hollywood","year":2019,"genre":["Comedy","Drama"],"director":"Quentin Tarantino","rating":7.6,"desc":"A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age.","tags":["hollywood","nostalgia","60s","bromance"],"mood":"fun"},
    {"id":110,"title":"Minority Report","year":2002,"genre":["Action","Crime","Mystery"],"director":"Steven Spielberg","rating":7.6,"desc":"In a future where a special police unit can arrest murderers before they commit their crimes, an officer from that unit is accused of future murder.","tags":["pre-crime","dystopia","chase","sci-fi"],"mood":"thrilling"},
    {"id":111,"title":"Finding Nemo","year":2003,"genre":["Animation","Adventure","Comedy"],"director":"Andrew Stanton","rating":8.2,"desc":"After his son is captured in the Great Barrier Reef, a timid clownfish sets out on a journey to bring him home.","tags":["ocean","family","adventure","animation"],"mood":"heartwarming"},
    {"id":112,"title":"Stalker","year":1979,"genre":["Drama","Sci-Fi"],"director":"Andrei Tarkovsky","rating":8.2,"desc":"A guide leads two men through a mystical area known as the Zone to find a room that grants a person's innermost desire.","tags":["philosophical","russian","art-house","metaphysical"],"mood":"thought-provoking"},
    {"id":113,"title":"Heat","year":1995,"genre":["Action","Crime","Drama"],"director":"Michael Mann","rating":8.3,"desc":"A group of high-profile professional thieves start to feel the heat from the LAPD when they unknowingly leave a clue.","tags":["heist","cat-and-mouse","los-angeles","crime"],"mood":"intense"},
    {"id":114,"title":"Howl's Moving Castle","year":2004,"genre":["Animation","Adventure","Family"],"director":"Hayao Miyazaki","rating":8.2,"desc":"When an unconfident young woman is cursed with an old body by a spiteful witch, her only chance of breaking the spell lies with a self-indulgent yet insecure young wizard.","tags":["anime","magical","war","love"],"mood":"whimsical"},
    {"id":115,"title":"American Beauty","year":1999,"genre":["Drama"],"director":"Sam Mendes","rating":8.3,"desc":"A sexually frustrated suburban father has a mid-life crisis after becoming infatuated with his daughter's best friend.","tags":["suburban","mid-life","beauty","dark-humor"],"mood":"dark"},
    {"id":116,"title":"The Iron Claw","year":2023,"genre":["Biography","Drama","Sport"],"director":"Sean Durkin","rating":7.6,"desc":"The true story of the Von Erich family, who made an indelible mark on professional wrestling.","tags":["wrestling","family","tragedy","sports"],"mood":"emotional"},
    {"id":117,"title":"Barbie","year":2023,"genre":["Adventure","Comedy","Fantasy"],"director":"Greta Gerwig","rating":6.8,"desc":"Barbie and Ken are having the time of their lives in the colorful Barbie Land, then get a chance to go to the real world.","tags":["feminist","comedy","colorful","existential"],"mood":"fun"},
    {"id":118,"title":"Uncut Gems","year":2019,"genre":["Crime","Drama","Thriller"],"director":"Safdie Brothers","rating":7.4,"desc":"A charismatic jeweler makes a high-stakes bet that could lead to the biggest windfall of his life.","tags":["gambling","anxiety","new-york","hustle"],"mood":"intense"},
    {"id":119,"title":"In the Mood for Love","year":2000,"genre":["Drama","Romance"],"director":"Wong Kar-wai","rating":8.1,"desc":"Two neighbors form a strong bond after both suspect extramarital activities of their spouses.","tags":["unrequited-love","hong-kong","restraint","visual"],"mood":"melancholy"},
    {"id":120,"title":"Nope","year":2022,"genre":["Horror","Mystery","Sci-Fi"],"director":"Jordan Peele","rating":6.8,"desc":"The residents of a lonely gulch in inland California bear witness to an uncanny and chilling discovery.","tags":["spectacle","ufo","horror","ranch"],"mood":"suspenseful"},
    {"id":121,"title":"The Northman","year":2022,"genre":["Action","Adventure","Drama"],"director":"Robert Eggers","rating":7.1,"desc":"A young Viking prince sets out on a quest to avenge his father's murder.","tags":["viking","revenge","mythological","brutal"],"mood":"epic"},
    {"id":122,"title":"Mulholland Drive","year":2001,"genre":["Drama","Mystery","Thriller"],"director":"David Lynch","rating":7.9,"desc":"After a car wreck on the winding Mulholland Drive, an amnesiac woman and a young Hollywood hopeful search for clues and answers across Los Angeles.","tags":["surreal","mystery","hollywood","dream"],"mood":"dark"},
    {"id":123,"title":"The Banshees of Inisherin","year":2022,"genre":["Comedy","Drama"],"director":"Martin McDonagh","rating":7.7,"desc":"Two lifelong friends find themselves at an impasse when one abruptly ends their relationship.","tags":["friendship","isolation","irish","dark-humor"],"mood":"melancholy"},
    {"id":124,"title":"The Fabelmans","year":2022,"genre":["Biography","Drama"],"director":"Steven Spielberg","rating":7.5,"desc":"Growing up in post-World War II era Arizona, a young man named Sammy Fabelman discovers a shattering family secret and explores how movies can help us see the truth.","tags":["coming-of-age","filmmaking","family","autobiographical"],"mood":"heartwarming"},
    {"id":125,"title":"RRR","year":2022,"genre":["Action","Drama"],"director":"S.S. Rajamouli","rating":7.8,"desc":"A fictitious story about two legendary revolutionaries and their journey away from and back to British India.","tags":["indian","action","friendship","colonial"],"mood":"epic"},
    {"id":126,"title":"Tár","year":2022,"genre":["Drama","Music"],"director":"Todd Field","rating":7.4,"desc":"A renowned conductor faces a reckoning when her past catches up with her.","tags":["music","power","cancel-culture","character-study"],"mood":"intense"},
    {"id":127,"title":"The Whale","year":2022,"genre":["Drama"],"director":"Darren Aronofsky","rating":7.7,"desc":"A reclusive English teacher attempts to reconnect with his estranged teenage daughter.","tags":["redemption","family","grief","chamber-piece"],"mood":"emotional"},
    {"id":128,"title":"Past Lives","year":2023,"genre":["Drama","Romance"],"director":"Celine Song","rating":7.8,"desc":"Nora and Hae Sung, two deeply connected childhood friends, are wrenched apart after Nora's family emigrates from South Korea.","tags":["immigration","fate","love","korean"],"mood":"melancholy"},
    {"id":129,"title":"Anatomy of a Fall","year":2023,"genre":["Crime","Drama","Thriller"],"director":"Justine Triet","rating":7.7,"desc":"A woman is suspected of her husband's murder, and their blind son faces a moral dilemma as the sole witness.","tags":["courtroom","marriage","french","ambiguity"],"mood":"suspenseful"},
    {"id":130,"title":"Killers of the Flower Moon","year":2023,"genre":["Crime","Drama","History"],"director":"Martin Scorsese","rating":7.6,"desc":"Members of the Osage tribe are murdered under mysterious circumstances in 1920s Oklahoma.","tags":["indigenous","true-crime","historical","conspiracy"],"mood":"intense"},
    {"id":131,"title":"Poor Things","year":2023,"genre":["Comedy","Drama","Romance"],"director":"Yorgos Lanthimos","rating":7.8,"desc":"The incredible tale of a young woman brought back to life by a brilliant scientist.","tags":["surreal","feminist","victorian","dark-humor"],"mood":"whimsical"},
    {"id":132,"title":"The Zone of Interest","year":2023,"genre":["Drama","History","War"],"director":"Jonathan Glazer","rating":7.4,"desc":"The commandant of Auschwitz and his wife strive to build a dream life for their family next to the camp.","tags":["holocaust","banality-of-evil","sound-design","horror"],"mood":"dark"},
    {"id":133,"title":"American Fiction","year":2023,"genre":["Comedy","Drama"],"director":"Cord Jefferson","rating":7.5,"desc":"A novelist fed up with the establishment profiting from Black entertainment writes a book to prove a point.","tags":["satire","race","publishing","meta"],"mood":"fun"},
    {"id":134,"title":"Saltburn","year":2023,"genre":["Comedy","Drama","Thriller"],"director":"Emerald Fennell","rating":7.0,"desc":"A student at Oxford University finds himself drawn into the world of a charming aristocratic classmate.","tags":["class","obsession","british","twisted"],"mood":"dark"},
    {"id":135,"title":"All Quiet on the Western Front","year":2022,"genre":["Action","Drama","War"],"director":"Edward Berger","rating":7.8,"desc":"A young German soldier's terrifying experiences during World War I.","tags":["war","anti-war","german","trenches"],"mood":"intense"},
    {"id":136,"title":"Triangle of Sadness","year":2022,"genre":["Comedy","Drama"],"director":"Ruben Östlund","rating":7.3,"desc":"A fashion model celebrity couple join an pointless cruise for the super-rich that sinks.","tags":["satire","class","dark-humor","stranded"],"mood":"dark"},
    {"id":137,"title":"Decision to Leave","year":2022,"genre":["Crime","Drama","Mystery"],"director":"Park Chan-wook","rating":7.4,"desc":"A detective investigating a man's death in the mountains becomes entangled with the dead man's wife.","tags":["mystery","romance","korean","obsession"],"mood":"melancholy"},
    {"id":138,"title":"Aftersun","year":2022,"genre":["Drama"],"director":"Charlotte Wells","rating":7.6,"desc":"Sophie reflects on the shared joy and private melancholy of a holiday she took with her father twenty years earlier.","tags":["memory","father-daughter","subtle","heartbreak"],"mood":"melancholy"},
    {"id":139,"title":"Marcel the Shell with Shoes On","year":2021,"genre":["Animation","Comedy","Drama"],"director":"Dean Fleischer Camp","rating":7.7,"desc":"Marcel is an adorable one-inch-tall shell who ekes out a colorful existence with his grandmother Connie in a Airbnb.","tags":["whimsical","documentary-style","adorable","loss"],"mood":"heartwarming"},
    {"id":140,"title":"The Power of the Dog","year":2021,"genre":["Drama","Romance","Western"],"director":"Jane Campion","rating":6.8,"desc":"A domineering rancher responds with mocking cruelty when his brother brings home a new wife and her son.","tags":["western","toxic-masculinity","slow-burn","revenge"],"mood":"suspenseful"},
    {"id":141,"title":"Dune: Part Two","year":2024,"genre":["Action","Adventure","Drama"],"director":"Denis Villeneuve","rating":8.5,"desc":"Paul Atreides unites with the Fremen to take revenge on the conspirators who destroyed his family and stop a terrible future only he can foresee.","tags":["sci-fi","desert","politics","epic","prophecy"],"mood":"epic"},
    {"id":142,"title":"Challengers","year":2024,"genre":["Drama","Romance","Sport"],"director":"Luca Guadagnino","rating":7.5,"desc":"A former tennis prodigy turned coach transforms her husband from mediocrity to greatness by pitting him against his former best friend and her former lover.","tags":["tennis","rivalry","love-triangle","sports"],"mood":"intense"},
    {"id":143,"title":"Civil War","year":2024,"genre":["Action","Drama","Sci-Fi"],"director":"Alex Garland","rating":6.7,"desc":"A team of military-embedded journalists race across a dystopian future America to reach DC before rebel factions descend upon the White House.","tags":["journalism","war","dystopia","america"],"mood":"intense"},
    {"id":144,"title":"Inside Out 2","year":2024,"genre":["Animation","Adventure","Comedy"],"director":"Kelsey Mann","rating":7.6,"desc":"As Riley enters puberty, new emotions arrive causing upheaval in her mind's Headquarters.","tags":["emotions","animation","puberty","anxiety"],"mood":"heartwarming"},
    {"id":145,"title":"Furiosa: A Mad Max Saga","year":2024,"genre":["Action","Adventure","Sci-Fi"],"director":"George Miller","rating":7.5,"desc":"The origin story of the rebel warrior Furiosa before her encounter with Mad Max.","tags":["post-apocalyptic","revenge","prequel","action"],"mood":"thrilling"},
    {"id":146,"title":"The Substance","year":2024,"genre":["Drama","Horror","Sci-Fi"],"director":"Coralie Fargeat","rating":7.3,"desc":"An aging celebrity takes a mysterious drug that creates a younger duplicate of herself.","tags":["body-horror","aging","beauty-standards","feminist"],"mood":"dark"},
    {"id":147,"title":"Nosferatu","year":2024,"genre":["Drama","Fantasy","Horror"],"director":"Robert Eggers","rating":7.2,"desc":"A gothic tale of obsession between a haunted young woman and the terrifying vampire infatuated with her.","tags":["vampire","gothic","horror","remake"],"mood":"dark"},
    {"id":148,"title":"The Brutalist","year":2024,"genre":["Drama"],"director":"Brady Corbet","rating":7.8,"desc":"A Hungarian-born Jewish architect emigrates with his wife to America to rebuild his life after surviving the Holocaust.","tags":["architecture","immigration","american-dream","art"],"mood":"epic"},
    {"id":149,"title":"Conclave","year":2024,"genre":["Drama","Mystery","Thriller"],"director":"Edward Berger","rating":7.7,"desc":"Following the unexpected death of the Pope, a Cardinal must oversee the selection of a new Pope.","tags":["vatican","politics","mystery","power"],"mood":"suspenseful"},
    {"id":150,"title":"A Real Pain","year":2024,"genre":["Comedy","Drama"],"director":"Jesse Eisenberg","rating":7.6,"desc":"Mismatched cousins reunite for a tour through Poland to honor their beloved grandmother.","tags":["family","holocaust","comedy","grief"],"mood":"bittersweet"},
    {"id":151,"title":"Anora","year":2024,"genre":["Comedy","Drama","Romance"],"director":"Sean Baker","rating":7.7,"desc":"A young sex worker from Brooklyn gets her chance at a Cinderella story when she meets and impulsively marries the son of an oligarch.","tags":["romance","class","comedy","gritty"],"mood":"fun"},
    {"id":152,"title":"The Wild Robot","year":2024,"genre":["Animation","Adventure","Family"],"director":"Chris Sanders","rating":8.1,"desc":"A robot shipwrecked on an uninhabited island must learn to adapt to the harsh environment and gradually builds relationships with the island's wildlife.","tags":["robot","nature","animation","motherhood"],"mood":"heartwarming"},
    {"id":153,"title":"Wicked","year":2024,"genre":["Drama","Fantasy","Musical"],"director":"Jon M. Chu","rating":7.5,"desc":"Misunderstood Elphaba forges an unlikely bond with the popular Glinda, until a clash of worldviews drives them apart.","tags":["musical","friendship","wizard-of-oz","magic"],"mood":"epic"},
    {"id":154,"title":"A Complete Unknown","year":2024,"genre":["Biography","Drama","Music"],"director":"James Mangold","rating":7.6,"desc":"A young Bob Dylan arrives in New York City in 1961 and shakes up the folk music world before controversially going electric.","tags":["music","biography","60s","folk"],"mood":"inspiring"},
    {"id":155,"title":"Sing Sing","year":2023,"genre":["Drama"],"director":"Greg Kwedar","rating":7.5,"desc":"A group of incarcerated men form a theater group within a correctional facility, discovering the transformative power of art.","tags":["prison","theater","redemption","art"],"mood":"inspiring"},
    {"id":156,"title":"Wonka","year":2023,"genre":["Adventure","Comedy","Family"],"director":"Paul King","rating":7.1,"desc":"The story of how young Willy Wonka and his chocolates changed the world.","tags":["chocolate","fantasy","whimsical","prequel"],"mood":"fun"},
    {"id":157,"title":"Bottoms","year":2023,"genre":["Comedy"],"director":"Emma Seligman","rating":6.6,"desc":"Two unpopular queer high schoolers start a fight club as a way to lose their virginity to cheerleaders.","tags":["teen","comedy","queer","absurd"],"mood":"fun"},
    {"id":158,"title":"The Holdovers","year":2023,"genre":["Comedy","Drama"],"director":"Alexander Payne","rating":7.9,"desc":"A curmudgeonly teacher at a boarding school reluctantly babysits students who have no place to go during Christmas break.","tags":["christmas","unlikely-friendship","school","1970s"],"mood":"heartwarming"},
    {"id":159,"title":"Priscilla","year":2023,"genre":["Biography","Drama","Romance"],"director":"Sofia Coppola","rating":6.7,"desc":"The story of Priscilla Presley's life with Elvis.","tags":["elvis","biography","romance","power-imbalance"],"mood":"melancholy"},
    {"id":160,"title":"May December","year":2023,"genre":["Comedy","Drama"],"director":"Todd Haynes","rating":7.0,"desc":"A Hollywood actress researches a woman who was involved in a tabloid scandal for an upcoming film role.","tags":["scandal","meta","acting","moral-ambiguity"],"mood":"suspenseful"},
    {"id":161,"title":"Godzilla Minus One","year":2023,"genre":["Action","Adventure","Drama"],"director":"Takashi Yamazaki","rating":7.8,"desc":"Post-war Japan is at its lowest point when a new threat emerges in the form of Godzilla.","tags":["kaiju","japanese","post-war","action"],"mood":"epic"},
    {"id":162,"title":"Society of the Snow","year":2023,"genre":["Adventure","Biography","Drama"],"director":"J.A. Bayona","rating":7.8,"desc":"The harrowing true story of a Uruguayan rugby team stranded in the Andes after their plane crashes.","tags":["survival","true-story","andes","human-spirit"],"mood":"intense"},
    {"id":163,"title":"Perfect Days","year":2023,"genre":["Drama"],"director":"Wim Wenders","rating":7.9,"desc":"A toilet cleaner in Tokyo leads a life of contentment, finding beauty in daily routine.","tags":["japanese","minimalism","routine","beauty"],"mood":"melancholy"},
    {"id":164,"title":"Asteroid City","year":2023,"genre":["Comedy","Drama","Romance"],"director":"Wes Anderson","rating":6.5,"desc":"A Junior Stargazer convention is disrupted by world-changing events in an American desert town.","tags":["quirky","visual","meta","ensemble"],"mood":"whimsical"},
    {"id":165,"title":"Io Capitano","year":2023,"genre":["Adventure","Drama"],"director":"Matteo Garrone","rating":7.5,"desc":"Two Senegalese teenagers embark on a dangerous journey from Dakar to Europe.","tags":["migration","africa","coming-of-age","survival"],"mood":"intense"},
    {"id":166,"title":"Ferrari","year":2023,"genre":["Biography","Drama","History"],"director":"Michael Mann","rating":6.4,"desc":"Enzo Ferrari faces a crisis in his auto empire while managing his personal life in 1957.","tags":["racing","biography","italian","ambition"],"mood":"intense"},
    {"id":167,"title":"Napoleon","year":2023,"genre":["Action","Adventure","Biography"],"director":"Ridley Scott","rating":6.4,"desc":"An epic that details the checkered rise and fall of French Emperor Napoleon Bonaparte and his relentless journey to power.","tags":["historical","war","biography","conquest"],"mood":"epic"},
    {"id":168,"title":"The Boy and the Heron","year":2023,"genre":["Animation","Adventure","Drama"],"director":"Hayao Miyazaki","rating":7.5,"desc":"A young boy mourning his mother discovers a world shared by the living and the dead.","tags":["anime","grief","magical","japanese"],"mood":"whimsical"},
    {"id":169,"title":"Maestro","year":2023,"genre":["Biography","Drama","Music"],"director":"Bradley Cooper","rating":6.6,"desc":"A portrait of the complex relationship between Leonard Bernstein and his wife Felicia Montealegre.","tags":["music","biography","marriage","conducting"],"mood":"emotional"},
    {"id":170,"title":"Nimona","year":2023,"genre":["Animation","Action","Adventure"],"director":"Nick Bruno","rating":7.6,"desc":"A knight framed for a crime teams up with a shapeshifting teen to prove his innocence.","tags":["animation","shapeshifter","identity","queer"],"mood":"fun"},
    {"id":171,"title":"Talk to Me","year":2022,"genre":["Horror","Thriller"],"director":"Danny Philippou","rating":7.1,"desc":"When a group of friends discover how to conjure spirits using an embalmed hand, they become hooked on the new thrill.","tags":["supernatural","teen","horror","viral"],"mood":"dark"},
    {"id":172,"title":"John Wick: Chapter 4","year":2023,"genre":["Action","Crime","Thriller"],"director":"Chad Stahelski","rating":7.7,"desc":"John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy.","tags":["action","assassin","revenge","stylized"],"mood":"thrilling"},
    {"id":173,"title":"Guardians of the Galaxy Vol. 3","year":2023,"genre":["Action","Adventure","Comedy"],"director":"James Gunn","rating":7.9,"desc":"The team rallies to protect one of their own, a mission that could mean the end of the Guardians.","tags":["space","team","superhero","emotional"],"mood":"emotional"},
    {"id":174,"title":"Mission: Impossible – Dead Reckoning Part One","year":2023,"genre":["Action","Adventure","Thriller"],"director":"Christopher McQuarrie","rating":7.7,"desc":"Ethan Hunt and his IMF team must track down a dangerous weapon before it falls into the wrong hands.","tags":["spy","action","ai-threat","stunts"],"mood":"thrilling"},
    {"id":175,"title":"Cocaine Bear","year":2023,"genre":["Comedy","Crime","Thriller"],"director":"Elizabeth Banks","rating":5.9,"desc":"An oddball group of cops, criminals and tourists converge in a Georgia forest where a 500-pound black bear goes on a rampage after ingesting cocaine.","tags":["comedy","absurd","animal","drug"],"mood":"fun"},
    {"id":176,"title":"The Creator","year":2023,"genre":["Action","Adventure","Sci-Fi"],"director":"Gareth Edwards","rating":6.8,"desc":"Against the backdrop of a war between humans and AI, a former agent discovers a weapon that could end the war.","tags":["ai","war","robot","dystopia"],"mood":"epic"},
    {"id":177,"title":"Beau Is Afraid","year":2023,"genre":["Comedy","Drama","Horror"],"director":"Ari Aster","rating":5.4,"desc":"An anxious man embarks on an increasingly surreal odyssey to get home to his mother.","tags":["anxiety","surreal","mother","absurd"],"mood":"dark"},
    {"id":178,"title":"The Killer","year":2023,"genre":["Action","Adventure","Crime"],"director":"David Fincher","rating":6.7,"desc":"An assassin begins to develop a conscience, causing an international crisis.","tags":["assassin","meticulous","globe-trotting","thriller"],"mood":"suspenseful"},
    {"id":179,"title":"Elemental","year":2023,"genre":["Animation","Comedy","Drama"],"director":"Peter Sohn","rating":7.0,"desc":"In a city where fire, water, earth, and air residents live together, a fiery young woman and a go-with-the-flow guy discover they have more in common despite their differences.","tags":["immigration","love","animation","elements"],"mood":"heartwarming"},
    {"id":180,"title":"Rye Lane","year":2023,"genre":["Comedy","Romance"],"director":"Raine Allen-Miller","rating":7.2,"desc":"Two young people wander around South London getting over their recent breakups.","tags":["romance","london","breakup","fun"],"mood":"fun"},
    {"id":181,"title":"Tenet","year":2020,"genre":["Action","Sci-Fi","Thriller"],"director":"Christopher Nolan","rating":7.3,"desc":"Armed with only one word—Tenet—and fighting for the survival of the world, the protagonist journeys through a twilight world of international espionage.","tags":["time-inversion","spy","mind-bending","action"],"mood":"thrilling"},
    {"id":182,"title":"Sound of Metal","year":2019,"genre":["Drama","Music"],"director":"Darius Marder","rating":7.8,"desc":"A heavy-metal drummer's life is thrown into freefall when he begins to lose his hearing.","tags":["deafness","music","acceptance","transformation"],"mood":"emotional"},
    {"id":183,"title":"The Father","year":2020,"genre":["Drama","Mystery"],"director":"Florian Zeller","rating":8.2,"desc":"A man refuses all assistance from his daughter as he ages. As he tries to make sense of his changing circumstances, he begins to doubt his loved ones.","tags":["dementia","aging","family","unreliable-perspective"],"mood":"emotional"},
    {"id":184,"title":"Nomadland","year":2020,"genre":["Drama"],"director":"Chloé Zhao","rating":7.3,"desc":"A woman in her sixties embarks on a journey through the American West, living as a van-dwelling modern-day nomad.","tags":["nomad","america","solitude","grief"],"mood":"melancholy"},
    {"id":185,"title":"Another Round","year":2020,"genre":["Comedy","Drama"],"director":"Thomas Vinterberg","rating":7.7,"desc":"Four high-school teachers consume alcohol on a daily basis to see how it affects their social and professional lives.","tags":["alcohol","mid-life","danish","experiment"],"mood":"bittersweet"},
    {"id":186,"title":"Promising Young Woman","year":2020,"genre":["Crime","Drama","Thriller"],"director":"Emerald Fennell","rating":7.5,"desc":"A young woman haunted by a traumatic past seeks revenge against those who crossed her path.","tags":["revenge","feminist","dark","twist"],"mood":"dark"},
    {"id":187,"title":"Minari","year":2020,"genre":["Drama"],"director":"Lee Isaac Chung","rating":7.4,"desc":"A Korean American family moves to a tiny Arkansas farm in search of the American Dream.","tags":["family","korean","american-dream","farming"],"mood":"heartwarming"},
    {"id":188,"title":"Soul","year":2020,"genre":["Animation","Adventure","Comedy"],"director":"Pete Docter","rating":8.0,"desc":"A musician who has lost his passion for music is transported out of his body and must find his way back with the help of a young soul.","tags":["animation","music","existential","purpose"],"mood":"inspiring"},
    {"id":189,"title":"Thelma & Louise","year":1991,"genre":["Adventure","Crime","Drama"],"director":"Ridley Scott","rating":7.6,"desc":"Two best friends set out on an adventure, but it soon turns into a flight from the law when one of them kills a man who tries to assault the other.","tags":["road-trip","feminist","friendship","freedom"],"mood":"thrilling"},
    {"id":190,"title":"Trainspotting","year":1996,"genre":["Drama"],"director":"Danny Boyle","rating":8.1,"desc":"Renton attempts to give up his heroin addiction as he and his friends sink deeper into despair.","tags":["addiction","scottish","youth","dark-humor"],"mood":"edgy"},
    {"id":191,"title":"Seven Samurai","year":1954,"genre":["Action","Drama"],"director":"Akira Kurosawa","rating":8.6,"desc":"Farmers from a village exploited by bandits hire seven ronin to protect them.","tags":["samurai","honor","japanese","epic"],"mood":"epic"},
    {"id":192,"title":"Casablanca","year":1942,"genre":["Drama","Romance","War"],"director":"Michael Curtiz","rating":8.5,"desc":"A cynical expatriate American cafe owner struggles with whether to help his former lover and her husband escape the Nazis in French Morocco.","tags":["war","romance","classic","sacrifice"],"mood":"emotional"},
    {"id":193,"title":"Rashomon","year":1950,"genre":["Crime","Drama","Mystery"],"director":"Akira Kurosawa","rating":8.2,"desc":"The rape of a bride and the murder of her samurai husband are recalled from the perspectives of various witnesses.","tags":["perspective","truth","japanese","classic"],"mood":"thought-provoking"},
    {"id":194,"title":"Psycho","year":1960,"genre":["Horror","Mystery","Thriller"],"director":"Alfred Hitchcock","rating":8.5,"desc":"A secretary on the run checks into a secluded motel run by a young man under his mother's domination.","tags":["horror","twist","classic","motel"],"mood":"suspenseful"},
    {"id":195,"title":"The Apartment","year":1960,"genre":["Comedy","Drama","Romance"],"director":"Billy Wilder","rating":8.3,"desc":"A man tries to rise in his company by lending his apartment to executives, but things get complicated when he falls for their elevator operator.","tags":["romance","corporate","classic","witty"],"mood":"bittersweet"},
    {"id":196,"title":"Vertigo","year":1958,"genre":["Mystery","Romance","Thriller"],"director":"Alfred Hitchcock","rating":8.3,"desc":"A former San Francisco police detective juggles pursuing a woman he is attracted to and his fear of heights.","tags":["obsession","classic","identity","psychological"],"mood":"suspenseful"},
    {"id":197,"title":"Sunset Boulevard","year":1950,"genre":["Drama","Film-Noir"],"director":"Billy Wilder","rating":8.4,"desc":"A screenwriter develops a dangerous relationship with a faded film star determined to make a triumphant return.","tags":["hollywood","obsession","classic","noir"],"mood":"dark"},
    {"id":198,"title":"Metropolis","year":1927,"genre":["Drama","Sci-Fi"],"director":"Fritz Lang","rating":8.3,"desc":"In a futuristic city sharply divided between the working class and the city planners, the son of the city's mastermind falls in love with a working-class prophet.","tags":["dystopia","class","robot","silent-film"],"mood":"epic"},
    {"id":199,"title":"Cinema Paradiso","year":1988,"genre":["Drama","Romance"],"director":"Giuseppe Tornatore","rating":8.5,"desc":"A filmmaker recalls his childhood when he fell in love with the movies at his village's cinema and formed a deep friendship with the theater's projectionist.","tags":["cinema","nostalgia","italian","friendship"],"mood":"heartwarming"},
    {"id":200,"title":"Tokyo Story","year":1953,"genre":["Drama"],"director":"Yasujirō Ozu","rating":8.2,"desc":"An aging couple visit their children and grandchildren in the city, but receive a cold welcome.","tags":["family","aging","japanese","classic"],"mood":"melancholy"},
]

# ─────────────────────────────────────────────
# DATA PROCESSING
# ─────────────────────────────────────────────

def load_movies():
    """Load and process movie dataset into a DataFrame."""
    df = pd.DataFrame(MOVIES_RAW)
    # Build combined text for TF-IDF
    df["text"] = df.apply(
        lambda r: " ".join([
            r["title"], r["desc"],
            " ".join(r["genre"]), r["director"],
            " ".join(r["tags"]), r["mood"], str(r["year"])
        ]).lower(), axis=1
    )
    return df


def build_tfidf(df):
    """Build TF-IDF matrix from movie text features."""
    vectorizer = TfidfVectorizer(
        max_features=5000,
        stop_words="english",
        ngram_range=(1, 2),
        min_df=1
    )
    tfidf_matrix = vectorizer.fit_transform(df["text"])
    sim_matrix = cosine_similarity(tfidf_matrix)
    return vectorizer, tfidf_matrix, sim_matrix


# ─────────────────────────────────────────────
# RECOMMENDATION ENGINES
# ─────────────────────────────────────────────

def content_based_recommend(liked_ids, disliked_ids, ratings_dict, df, sim_matrix, top_k=12):
    """Content-based filtering using TF-IDF cosine similarity."""
    pos_ids = list(liked_ids) + [int(i) for i, r in ratings_dict.items() if r >= 4]
    neg_ids = list(disliked_ids) + [int(i) for i, r in ratings_dict.items() if r <= 2]
    seen = set(liked_ids) | set(disliked_ids) | set(int(i) for i in ratings_dict.keys())

    if not pos_ids:
        return []

    id_to_idx = {mid: idx for idx, mid in enumerate(df["id"])}

    # Build profile: weighted sum of positive, subtract negatives
    profile = np.zeros(sim_matrix.shape[0])
    for mid in pos_ids:
        if mid in id_to_idx:
            weight = ratings_dict.get(str(mid), 4) / 5.0
            profile += sim_matrix[id_to_idx[mid]] * weight
    for mid in neg_ids:
        if mid in id_to_idx:
            profile -= sim_matrix[id_to_idx[mid]] * 0.5

    # Score all unseen movies
    results = []
    for idx, row in df.iterrows():
        mid = row["id"]
        if mid in seen:
            continue
        score = float(profile[idx])
        explanation = _generate_explanation(row, pos_ids, df, sim_matrix, id_to_idx)
        results.append({
            "movie": row.to_dict(),
            "score": score,
            "explanation": explanation,
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    # Normalize scores to 0-1
    if results:
        max_s = max(r["score"] for r in results) or 1
        min_s = min(r["score"] for r in results)
        rng = max_s - min_s if max_s != min_s else 1
        for r in results:
            r["score"] = (r["score"] - min_s) / rng
    return results[:top_k]


def _generate_explanation(movie, pos_ids, df, sim_matrix, id_to_idx):
    """Generate a specific explanation for why a movie is recommended."""
    parts = []
    mid = movie["id"]
    if mid not in id_to_idx:
        return "Matches your overall taste profile."

    # Find most similar liked movie
    best_sim = 0
    best_title = ""
    for pid in pos_ids:
        if pid in id_to_idx:
            s = sim_matrix[id_to_idx[mid], id_to_idx[pid]]
            if s > best_sim:
                best_sim = s
                best_title = df.iloc[id_to_idx[pid]]["title"]

    if best_title:
        parts.append(f'Strong thematic similarity to "{best_title}" ({best_sim*100:.0f}% match)')

    # Shared director
    liked_movies = [df.iloc[id_to_idx[pid]] for pid in pos_ids if pid in id_to_idx]
    dir_matches = [lm["title"] for lm in liked_movies if lm["director"] == movie["director"]]
    if dir_matches:
        parts.append(f'Directed by {movie["director"]}, whose work you enjoyed in "{dir_matches[0]}"')

    # Shared genres
    liked_genres = set()
    for lm in liked_movies:
        liked_genres.update(lm["genre"])
    shared_g = [g for g in movie["genre"] if g in liked_genres]
    if shared_g:
        parts.append(f'Shares {", ".join(shared_g[:3])} genre elements you gravitate toward')

    # Shared tags
    liked_tags = set()
    for lm in liked_movies:
        liked_tags.update(lm["tags"])
    shared_t = [t for t in movie["tags"] if t in liked_tags]
    if shared_t:
        parts.append(f'Features themes of {", ".join(shared_t[:4])} that align with your taste')

    # Shared mood
    liked_moods = set(lm["mood"] for lm in liked_movies)
    if movie["mood"] in liked_moods:
        parts.append(f'Has a {movie["mood"]} tone matching your preferred mood')

    return ". ".join(parts[:3]) + "." if parts else f'Matches your preference profile with {"/".join(movie["genre"])} elements.'


def nlp_search_recommend(query, df, vectorizer, tfidf_matrix, exclude_ids=None, top_k=12):
    """NLP semantic search: match natural language query against movie embeddings."""
    if not query.strip():
        return []

    exclude = set(exclude_ids or [])
    query_vec = vectorizer.transform([query.lower()])
    scores = cosine_similarity(query_vec, tfidf_matrix).flatten()

    results = []
    for idx, row in df.iterrows():
        if row["id"] in exclude:
            continue
        score = float(scores[idx])
        if score < 0.01:
            continue

        # Build query-specific explanation
        query_tokens = set(query.lower().split())
        matched_tags = [t for t in row["tags"] if any(q in t or t in q for q in query_tokens)]
        matched_genres = [g for g in row["genre"] if g.lower() in query.lower()]
        mood_match = row["mood"] in query.lower()

        exp_parts = []
        if matched_genres:
            exp_parts.append(f'Matches your interest in {", ".join(matched_genres)} films')
        if matched_tags:
            exp_parts.append(f'Contains "{", ".join(matched_tags[:3])}" themes you described')
        if mood_match:
            exp_parts.append(f'Has the {row["mood"]} tone you\'re looking for')
        if not exp_parts:
            exp_parts.append(f'High semantic match to your description based on thematic analysis')

        results.append({
            "movie": row.to_dict(),
            "score": score,
            "explanation": ". ".join(exp_parts) + ".",
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]


def llm_recommend(query, liked_movies, disliked_movies, ratings_dict, df, api_key):
    """LLM-powered recommendations using the Anthropic API."""
    try:
        import anthropic
    except ImportError:
        return None, "Install anthropic package: pip install anthropic"

    if not api_key:
        return None, "Set your Anthropic API key in the sidebar to use LLM mode."

    rated_info = []
    for mid_str, r in ratings_dict.items():
        m = df[df["id"] == int(mid_str)]
        if not m.empty:
            rated_info.append(f'"{m.iloc[0]["title"]}" ({r}/5)')

    movie_catalog = "\n".join(
        f'ID:{r["id"]} "{r["title"]}" ({r["year"]}) [{",".join(r["genre"])}] {r["mood"]} - {",".join(r["tags"])}'
        for _, r in df.iterrows()
    )

    prompt = f"""You are a movie recommendation system. Based on the user's preferences, recommend 8 movies from the provided catalog. For each, explain WHY specifically based on the user's taste.

USER PREFERENCES:
{f'Description: "{query}"' if query else ""}
{f'Liked: {", ".join(f""""{m}" """ for m in liked_movies)}' if liked_movies else ""}
{f'Disliked: {", ".join(f""""{m}" """ for m in disliked_movies)}' if disliked_movies else ""}
{f'Ratings: {", ".join(rated_info)}' if rated_info else ""}

AVAILABLE MOVIES (return ONLY from this list):
{movie_catalog}

Return ONLY valid JSON array, no markdown, no backticks:
[{{"id": <number>, "title": "<string>", "explanation": "<specific 1-2 sentence explanation referencing user preferences and movie attributes>"}}]"""

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            system="You are a movie recommendation engine. Return ONLY a JSON array. No markdown, no code blocks. Each recommendation must reference specific user preferences.",
            messages=[{"role": "user", "content": prompt}],
        )
        text = message.content[0].text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        recs = json.loads(text)

        results = []
        for rec in recs:
            match = df[df["id"] == rec["id"]]
            if not match.empty:
                results.append({
                    "movie": match.iloc[0].to_dict(),
                    "score": 0.95,
                    "explanation": rec["explanation"],
                })
        return results, None
    except Exception as e:
        return None, str(e)


# ─────────────────────────────────────────────
# EVALUATION METRICS
# ─────────────────────────────────────────────

def compute_metrics(recs, liked_ids, df):
    """Compute recommendation quality metrics."""
    if not recs:
        return {}

    top_k = min(5, len(recs))
    top_recs = recs[:top_k]

    # Precision@K (genre relevance proxy)
    liked_genres = set()
    for mid in liked_ids:
        m = df[df["id"] == mid]
        if not m.empty:
            liked_genres.update(m.iloc[0]["genre"])

    if liked_ids:
        relevant = sum(1 for r in top_recs if any(g in liked_genres for g in r["movie"]["genre"]))
        precision_at_k = relevant / top_k
    else:
        precision_at_k = 0

    # NDCG
    dcg, idcg = 0, 0
    for i, r in enumerate(top_recs):
        rel = 1 if any(g in liked_genres for g in r["movie"]["genre"]) else 0
        dcg += rel / math.log2(i + 2)
        idcg += 1 / math.log2(i + 2)
    ndcg = dcg / idcg if idcg > 0 else 0

    # Diversity (genre variety in recs)
    rec_genres = set()
    for r in recs:
        rec_genres.update(r["movie"]["genre"])
    all_genres = set()
    for _, row in df.iterrows():
        all_genres.update(row["genre"])
    diversity = len(rec_genres) / max(1, min(len(recs) * 2, len(all_genres)))

    # Coverage
    coverage = len(rec_genres) / len(all_genres) if all_genres else 0

    # Avg score
    avg_score = np.mean([r["score"] for r in recs])

    return {
        "Precision@5": precision_at_k,
        "NDCG": ndcg,
        "Intra-list Diversity": diversity,
        "Genre Coverage": coverage,
        "Avg Similarity Score": float(avg_score),
    }


# ─────────────────────────────────────────────
# MOOD COLORS
# ─────────────────────────────────────────────

MOOD_COLORS = {
    "inspiring": "#22c55e", "intense": "#ef4444", "thrilling": "#f97316",
    "edgy": "#a855f7", "emotional": "#3b82f6", "epic": "#eab308",
    "dark": "#6b7280", "heartwarming": "#f472b6", "whimsical": "#06b6d4",
    "thought-provoking": "#8b5cf6", "fun": "#84cc16", "suspenseful": "#dc2626",
    "melancholy": "#6366f1", "bittersweet": "#d97706",
}


# ─────────────────────────────────────────────
# STREAMLIT APP
# ─────────────────────────────────────────────

def main():
    st.set_page_config(
        page_title="CineMatch AI",
        page_icon="🎬",
        layout="wide",
        initial_sidebar_state="expanded",
    )

    # Custom CSS
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .stApp {
        background-color: #0a0a14;
        color: #e0e0f0;
    }
    .main-header {
        background: linear-gradient(135deg, #0e0e1a 0%, #16162a 100%);
        padding: 24px 32px;
        border-radius: 16px;
        border: 1px solid #2a2a3e;
        margin-bottom: 24px;
    }
    .main-header h1 {
        background: linear-gradient(90deg, #f0f0f8, #8888b0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 28px;
        margin: 0;
    }
    .movie-card {
        background: linear-gradient(135deg, #16162a 0%, #1a1a2e 100%);
        border: 1px solid #2a2a3e;
        border-radius: 14px;
        padding: 18px;
        margin-bottom: 12px;
        transition: all 0.2s;
    }
    .movie-card:hover {
        border-color: #3a3a5e;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .movie-title {
        color: #f0f0f8;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 4px;
    }
    .movie-meta {
        color: #8888a0;
        font-size: 13px;
    }
    .mood-tag {
        display: inline-block;
        padding: 2px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
    }
    .genre-tag {
        display: inline-block;
        font-size: 11px;
        padding: 2px 8px;
        border-radius: 4px;
        background: #2a2a3e;
        color: #9999b0;
        margin-right: 4px;
        font-weight: 500;
    }
    .explanation-box {
        background: linear-gradient(135deg, rgba(34,197,94,0.05), rgba(59,130,246,0.05));
        border: 1px solid rgba(34,197,94,0.15);
        border-radius: 10px;
        padding: 12px 16px;
        margin-top: 8px;
    }
    .explanation-label {
        font-size: 10px;
        font-weight: 700;
        color: #22c55e;
        letter-spacing: 1px;
        text-transform: uppercase;
        margin-bottom: 4px;
    }
    .explanation-text {
        color: #c0c0d0;
        font-size: 13px;
        line-height: 1.5;
    }
    .match-badge {
        padding: 3px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        font-family: monospace;
    }
    .metric-card {
        background: #16162a;
        border: 1px solid #2a2a3e;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }
    .metric-value {
        font-size: 28px;
        font-weight: 700;
        font-family: monospace;
    }
    .metric-label {
        font-size: 12px;
        color: #6666a0;
        margin-top: 4px;
    }
    .stSelectbox > div > div { background-color: #16162a; }
    div[data-testid="stSidebar"] { background-color: #0e0e1a; }
    .stMultiSelect > div > div { background-color: #16162a; }
    </style>
    """, unsafe_allow_html=True)

    # Initialize session state
    if "liked" not in st.session_state:
        st.session_state.liked = set()
    if "disliked" not in st.session_state:
        st.session_state.disliked = set()
    if "ratings" not in st.session_state:
        st.session_state.ratings = {}
    if "recs" not in st.session_state:
        st.session_state.recs = []
    if "metrics" not in st.session_state:
        st.session_state.metrics = {}
    if "feedback" not in st.session_state:
        st.session_state.feedback = {}

    # Load data
    df = load_movies()
    vectorizer, tfidf_matrix, sim_matrix = build_tfidf(df)

    all_genres = sorted(set(g for genres in df["genre"] for g in genres))
    all_moods = sorted(df["mood"].unique())

    # ── HEADER ──
    st.markdown("""
    <div class="main-header">
        <h1>🎬 CineMatch AI</h1>
        <p style="color: #6666a0; margin: 4px 0 0 0; font-size: 14px;">
            AI-powered movie recommendations with explainable matching · 200 films · TF-IDF + LLM
        </p>
    </div>
    """, unsafe_allow_html=True)

    # ── SIDEBAR ──
    with st.sidebar:
        st.markdown("### ⚙️ Configuration")

        mode = st.selectbox(
            "Recommendation Engine",
            ["Content-Based Filtering", "NLP Semantic Search", "LLM AI (Claude)"],
            help="Content-Based uses TF-IDF similarity. NLP uses query matching. LLM uses Claude AI."
        )

        api_key = ""
        if mode == "LLM AI (Claude)":
            api_key = st.text_input(
                "Anthropic API Key",
                type="password",
                help="Get your key at console.anthropic.com"
            )

        query = st.text_area(
            "Describe what you want to watch",
            placeholder="e.g., dark psychological thrillers with plot twists, or something heartwarming about family...",
            height=80,
        )

        st.markdown("---")

        st.markdown("### 🎯 Filter Catalog")
        selected_genres = st.multiselect("Filter by genre", all_genres)
        selected_moods = st.multiselect("Filter by mood", all_moods)
        search_text = st.text_input("Search movies", placeholder="Title, director, or tag...")

        st.markdown("---")

        # Status
        st.markdown("### 📊 Your Profile")
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Liked", len(st.session_state.liked))
        with col2:
            st.metric("Disliked", len(st.session_state.disliked))
        with col3:
            st.metric("Rated", len(st.session_state.ratings))

        st.markdown("---")

        # Generate button
        has_input = (
            st.session_state.liked or st.session_state.disliked
            or st.session_state.ratings or query.strip()
        )

        if st.button(
            "🚀 Get Recommendations",
            type="primary",
            disabled=not has_input,
            use_container_width=True,
        ):
            with st.spinner("Generating recommendations..."):
                if mode == "Content-Based Filtering":
                    st.session_state.recs = content_based_recommend(
                        st.session_state.liked, st.session_state.disliked,
                        st.session_state.ratings, df, sim_matrix
                    )
                elif mode == "NLP Semantic Search":
                    exclude = (
                        st.session_state.liked | st.session_state.disliked
                        | set(int(i) for i in st.session_state.ratings.keys())
                    )
                    st.session_state.recs = nlp_search_recommend(
                        query, df, vectorizer, tfidf_matrix, exclude
                    )
                else:  # LLM
                    liked_titles = [
                        df[df["id"] == mid].iloc[0]["title"]
                        for mid in st.session_state.liked
                        if not df[df["id"] == mid].empty
                    ]
                    disliked_titles = [
                        df[df["id"] == mid].iloc[0]["title"]
                        for mid in st.session_state.disliked
                        if not df[df["id"] == mid].empty
                    ]
                    results, error = llm_recommend(
                        query, liked_titles, disliked_titles,
                        st.session_state.ratings, df, api_key
                    )
                    if results:
                        st.session_state.recs = results
                    elif error:
                        st.error(f"LLM Error: {error}")
                        # Fallback
                        st.session_state.recs = content_based_recommend(
                            st.session_state.liked, st.session_state.disliked,
                            st.session_state.ratings, df, sim_matrix
                        )

                st.session_state.metrics = compute_metrics(
                    st.session_state.recs, list(st.session_state.liked), df
                )

        if not has_input:
            st.caption("Like/rate some movies or describe your preferences to get started")

        if st.button("🗑️ Reset Profile", use_container_width=True):
            st.session_state.liked = set()
            st.session_state.disliked = set()
            st.session_state.ratings = {}
            st.session_state.recs = []
            st.session_state.metrics = {}
            st.session_state.feedback = {}
            st.rerun()

    # ── MAIN CONTENT ──
    tab_browse, tab_recs, tab_metrics = st.tabs(["🎥 Browse Movies", "🎯 Recommendations", "📊 Metrics"])

    # ── BROWSE TAB ──
    with tab_browse:
        # Filter movies
        filtered = df.copy()
        if search_text:
            q = search_text.lower()
            filtered = filtered[
                filtered["title"].str.lower().str.contains(q, na=False)
                | filtered["director"].str.lower().str.contains(q, na=False)
                | filtered["tags"].apply(lambda tags: any(q in t for t in tags))
            ]
        if selected_genres:
            filtered = filtered[filtered["genre"].apply(lambda gs: any(g in selected_genres for g in gs))]
        if selected_moods:
            filtered = filtered[filtered["mood"].isin(selected_moods)]

        st.caption(f"Showing {len(filtered)} films — like, dislike, or rate to build your taste profile")

        # Display movies in columns
        cols_per_row = 2
        for i in range(0, len(filtered), cols_per_row):
            cols = st.columns(cols_per_row)
            for j, col in enumerate(cols):
                if i + j >= len(filtered):
                    break
                row = filtered.iloc[i + j]
                mid = row["id"]
                is_liked = mid in st.session_state.liked
                is_disliked = mid in st.session_state.disliked
                cur_rating = st.session_state.ratings.get(str(mid), 0)

                mood_color = MOOD_COLORS.get(row["mood"], "#666")

                with col:
                    border_color = "#22c55e55" if is_liked else "#ef444455" if is_disliked else "#2a2a3e"
                    st.markdown(f"""
                    <div class="movie-card" style="border-color: {border_color};">
                        <div class="movie-title">{row["title"]}</div>
                        <div class="movie-meta">
                            {row["year"]} · {row["director"]} · <span style="color: #facc15;">★ {row["rating"]}</span>
                        </div>
                        <div style="margin: 6px 0;">
                            {"".join(f'<span class="genre-tag">{g}</span>' for g in row["genre"])}
                            <span class="mood-tag" style="background: {mood_color}22; color: {mood_color}; border: 1px solid {mood_color}44;">{row["mood"]}</span>
                        </div>
                        <p style="font-size: 12px; color: #8888a0; line-height: 1.5; margin: 8px 0;">{row["desc"][:150]}...</p>
                        <div style="font-size: 11px; color: #5555770;">
                            {"  ".join(f"#{t}" for t in row["tags"])}
                        </div>
                    </div>
                    """, unsafe_allow_html=True)

                    bcols = st.columns([1, 1, 2])
                    with bcols[0]:
                        label = "✅ Liked" if is_liked else "👍 Like"
                        if st.button(label, key=f"like_{mid}", use_container_width=True):
                            if is_liked:
                                st.session_state.liked.discard(mid)
                            else:
                                st.session_state.liked.add(mid)
                                st.session_state.disliked.discard(mid)
                            st.rerun()
                    with bcols[1]:
                        label = "❌ Nope" if is_disliked else "👎 Pass"
                        if st.button(label, key=f"dislike_{mid}", use_container_width=True):
                            if is_disliked:
                                st.session_state.disliked.discard(mid)
                            else:
                                st.session_state.disliked.add(mid)
                                st.session_state.liked.discard(mid)
                            st.rerun()
                    with bcols[2]:
                        r = st.slider(
                            "Rate", 0, 5, cur_rating,
                            key=f"rate_{mid}",
                            label_visibility="collapsed",
                            help="0 = not rated, 1-5 stars"
                        )
                        if r != cur_rating:
                            if r > 0:
                                st.session_state.ratings[str(mid)] = r
                            elif str(mid) in st.session_state.ratings:
                                del st.session_state.ratings[str(mid)]
                            st.rerun()

    # ── RECOMMENDATIONS TAB ──
    with tab_recs:
        if not st.session_state.recs:
            st.markdown("""
            <div style="text-align: center; padding: 60px; color: #55557a;">
                <div style="font-size: 48px; margin-bottom: 16px;">🎯</div>
                <p style="font-size: 16px;">No recommendations yet.</p>
                <p>Build your taste profile in the Browse tab, then click <strong>Get Recommendations</strong> in the sidebar.</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            engine_name = mode
            st.markdown(f"**{len(st.session_state.recs)} personalized picks** via *{engine_name}*")

            for i, rec in enumerate(st.session_state.recs):
                m = rec["movie"]
                score = rec["score"]
                explanation = rec["explanation"]
                mood_color = MOOD_COLORS.get(m["mood"], "#666")

                score_color = "#22c55e" if score > 0.7 else "#eab308" if score > 0.4 else "#3b82f6"
                score_bg = f"{score_color}22"

                st.markdown(f"""
                <div class="movie-card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div>
                            <div class="movie-title">{m["title"]}</div>
                            <div class="movie-meta">
                                {m["year"]} · {m["director"]} · <span style="color: #facc15;">★ {m["rating"]}</span>
                            </div>
                        </div>
                        <span class="match-badge" style="background: {score_bg}; color: {score_color};">
                            {score*100:.0f}% match
                        </span>
                    </div>
                    <div style="margin: 6px 0;">
                        {"".join(f'<span class="genre-tag">{g}</span>' for g in m["genre"])}
                        <span class="mood-tag" style="background: {mood_color}22; color: {mood_color}; border: 1px solid {mood_color}44;">{m["mood"]}</span>
                    </div>
                    <p style="font-size: 13px; color: #9999b0; line-height: 1.5; margin: 8px 0;">{m["desc"]}</p>
                    <div class="explanation-box">
                        <div class="explanation-label">Why This Recommendation</div>
                        <div class="explanation-text">{explanation}</div>
                    </div>
                    <div style="margin-top: 8px; font-size: 11px; color: #555770;">
                        {"  ".join(f"#{t}" for t in m["tags"])}
                    </div>
                </div>
                """, unsafe_allow_html=True)

                # Feedback buttons
                fcols = st.columns([4, 1, 1])
                with fcols[0]:
                    st.caption("Was this recommendation helpful?")
                with fcols[1]:
                    if st.button("👍", key=f"fb_up_{m['id']}"):
                        st.session_state.feedback[m["id"]] = "positive"
                        st.rerun()
                with fcols[2]:
                    if st.button("👎", key=f"fb_down_{m['id']}"):
                        st.session_state.feedback[m["id"]] = "negative"
                        st.rerun()

                if m["id"] in st.session_state.feedback:
                    fb = st.session_state.feedback[m["id"]]
                    st.caption(f"{'✅ Marked helpful' if fb == 'positive' else '❌ Marked not helpful'}")

    # ── METRICS TAB ──
    with tab_metrics:
        st.markdown("### Evaluation Metrics")
        st.caption("Measuring recommendation quality across accuracy, diversity, and coverage dimensions")

        if st.session_state.metrics:
            metrics = st.session_state.metrics

            # Metric cards
            mcols = st.columns(5)
            colors = ["#22c55e", "#3b82f6", "#a855f7", "#f97316", "#06b6d4"]
            for i, (name, val) in enumerate(metrics.items()):
                with mcols[i]:
                    st.markdown(f"""
                    <div class="metric-card">
                        <div class="metric-value" style="color: {colors[i]};">{val*100:.1f}%</div>
                        <div class="metric-label">{name}</div>
                    </div>
                    """, unsafe_allow_html=True)

            # Progress bars
            st.markdown("#### Detailed Breakdown")
            for i, (name, val) in enumerate(metrics.items()):
                st.markdown(f"**{name}**")
                st.progress(min(val, 1.0))

            # Feedback stats
            st.markdown("---")
            st.markdown("#### User Feedback Signals")
            fb = st.session_state.feedback
            pos = sum(1 for v in fb.values() if v == "positive")
            neg = sum(1 for v in fb.values() if v == "negative")
            total = len(fb)

            fcols = st.columns(3)
            with fcols[0]:
                st.metric("Positive", pos)
            with fcols[1]:
                st.metric("Negative", neg)
            with fcols[2]:
                ratio = f"{pos/total*100:.0f}%" if total > 0 else "—"
                st.metric("Like Ratio (CTR)", ratio)

            # System info
            st.markdown("---")
            st.markdown("#### System Configuration")
            config_data = {
                "Parameter": ["Dataset", "Embedding", "Similarity", "Approaches", "Input Methods", "Metrics"],
                "Value": [
                    f"{len(df)} movies (1927–2024)",
                    "TF-IDF (title + desc + genres + tags + mood + director)",
                    "Cosine similarity (scikit-learn)",
                    "Content-Based, NLP Search, LLM (Claude)",
                    "Like/dislike, star ratings, natural language, genre/mood filters",
                    "Precision@K, NDCG, Diversity, Coverage, User Satisfaction (CTR)",
                ]
            }
            st.table(pd.DataFrame(config_data))
        else:
            st.info("Generate recommendations first to see evaluation metrics.")


if __name__ == "__main__":
    main()
