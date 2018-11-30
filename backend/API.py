from freelancersdk.session import Session
from freelancersdk.resources.projects \
	import (create_project,
		create_budget_object,
		create_currency_object,
		create_job_object)
from freelancersdk.resources.projects.projects import get_bids
from freelancersdk.resources.projects import award_project_bid
from freelancersdk.exceptions import ProjectNotCreatedException
from freelancersdk.exceptions import BidNotAwardedException
from freelancersdk.resources.projects.exceptions import \
    BidsNotFoundException
import os


token = "EOggY3LOCLapNHaOyF3yUGamcfI48E"
url = "https://www.freelancer-sandbox.com"
projecturl = "https://www.freelancer.com/api/projects/0.1/bids/154/" #/projects/0.1/bids/{bid_id}/
theproject = "https://www.freelancer-sandbox.com/projects/java/Hello-guys"

#SAMPLE TITLE
testtitle = "testestsetHellooooooooooooooooo guys"
testdesc = "This is the sample project we made!"


def test_create_project(title, desc):
	oauth_token = token
	session = Session(oauth_token = oauth_token, url = url)

	project_data = {
		'title': title,
		'description': desc,
		'currency': create_currency_object(id=1),
		'budget': create_budget_object(minimum=10),
		'jobs': [create_job_object(id=3)],
	} 

	try:
		p = create_project(session, **project_data)
	except ProjectNotCreatedException as e:
		print(("Error message: %s" %e.message))
		print(("Error code:"))
		return None 
	else:
		return p 

def test_get_bids(token, url):
	oauth_token = token
	session = Session(oauth_token=oauth_token, url=url)

	get_bids_data = {
	'project_ids': [
	101,
	102,
	],
	'limit': 10,
	'offset': 0,
	}

	try:
		b = get_bids(session, **get_bids_data)
	except BidsNotFoundException as e:
		print("Error message: {}".format(e.message))
		print("Server response: {}".format(e.error_code))
	else:
		return b

def test_award_bid(token, url):
	oauth_token = token
	session = Session(oauth_token=oauth_token, url=url)

	bid_data = {
		'bid_id': 1
	}

	try:
		return award_project_bid(session, **bid_data)
	except BidNotAwardedException as e:
		print("Bid Award Error")
		#print("Error message: {}".format(e.message))
		print("Error code: {}".format(e.error_code))
		return None

"""
p = test_create_project(testtitle, testdesc)
if p:
	print(("Project created: %s" %p.url))
"""
"""
b = test_get_bids(token, theproject)
print(b)
if b:
    print('Found bids: {}'.format(len(b['bids'])))
"""
"""
b = test_award_bid(token, projecturl)
if b:
	print(("Bid awarded: %s" %b))"""

#Get the SKills
#curl -X GET https://www.freelancer.com/api/projects/0.1/jobs/ --header 'freelancer-oauth-v1: EOggY3LOCLapNHaOyF3yUGamcfI48E' 
