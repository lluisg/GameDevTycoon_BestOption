# GameDevTycoon_BestOption


values topic/genre:
https://gamedevtycoon.fandom.com/wiki/Raw_Data_for_Review_Algorithm/1.4.3#Topic_Genre_Combinations

values topic/audiences:
https://gamedevtycoon.fandom.com/wiki/Raw_Data_for_Review_Algorithm/1.4.3#Topic_Audience_Combinations

values platform/audience + platform/genre: https://steamcommunity.com/sharedfiles/filedetails/?id=176835673

values genre/development:
https://gamedevtycoon.fandom.com/wiki/Raw_Data_for_Review_Algorithm/1.4.3#Development_Weight_for_Tech_and_Design_Ratios



not recommended with multi genre
not repeat same genre/topic
sequels with updated motors/graph



assign > 40% design goal >= 0.9 and < 40% design goal < 0.8

score 1 with selling possibility:
platform/genre*topic/genre*genre/audience

score 2 (sells):
score1 * platform/audience












--------------- DATOS EXTRA -----------------------------------------------------------
https://gamedevtycoon.fandom.com/wiki/Review_Algorithm/1.4.4#Combination_study


q = 1
MMOMOD=1 if MMO, 2 if not MMO

t = (D * R - T)/max(T,D)
D design
T technic
R ratio defined on data
if |t|<= 0.25 -> q+0.1
if |t|>0.5 -> q-0.1


>40% time allocation on design goal >= 0.9
	on 2 phases -> q+0.2
	on 1 phase -> q+0.1
	never -> 1-(0.15*MMOMOD)

>40% time allocation on design goal < 0.8
	2 ph -> q-0.2*MMOMOD
	1 -> q-0.1*MMOMOD

<20% design goal >=0.9:
	(q-0.15*MMOMOD)*#phase

multigenre: 2/3*q first + 1/3*q 2nd





g = m * q * p * o * r * t
p = platform/genre
o = topic/audience

