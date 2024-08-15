# Contribution towards FlashcardAI Project

For the work to be done

All the keys are in .env.example file in both server and client

create a file .env.local in client and server folder

copy the keys from .env.example to .env.local file. The values of the keys are saved in a txt file pinned to discord general chat.

DONT SHARE IT WITH ANYONE

## BACKEND CODE SETUP

For the backend code `cd` into server folder. Create a virtual env using `python -m venv .venv`. (This is for linux and macos. For windows check how to create a virtual env)

For Linux and MacOS -> activate using `source .venv/bin/activate`. Deactivation -> `deactivate`

For windows users -> activate using `.venv\Scripts\activate`

NOTE: CREATION OF VIRTUAL ENV FOR BACKEND CODE IS IMPORTANT

To install the packages in requirements.txt -> `pip install -r requirements.txt`
After installing new packages always do -> `pip freeze > requirements.txt`

Check if you already have pip installed. If not do so.

## FRONTEND CODE SETUP

cd into client folder.

Run `npm install` in the terminal. This will install all the packages.

To run the server -> `npm run dev`

## Do Note

Always create branch from staging. This is the intermediary branch. DO NOT WORK DIRECTLY IN THE `main` BRANCH.

And when feature is done. Merge the code into the staging branch
