from fastapi import FastAPI

app = FastAPI(title="Airline Flight Management Backend")

@app.get("/")
def root():
    return {"message": "Backend is running"}
