
## Directory Structure
The backend directory is organized as follows:

## Key Components

### main.py
- Initializes the FastAPI app.
- Includes middleware, event handlers, and route definitions.

### models/
- **Pydantic Models**: Used for data validation and serialization.
- **SQLAlchemy Models**: Defines the database schema and ORM mappings.

### routes/
- Defines the API endpoints and their corresponding request handlers.

### utils/
- Provides utility functions and helpers.


## Getting Started
1. **Install Dependencies**: Install the required dependencies using `pip install -r requirements.txt`.
2. **Run the Server**: Start the FastAPI server using `uvicorn app.main:app --reload`.
3. **Access the API**: The API can be accessed at `http://localhost:8000`.

