# Ducky Project Backend

## Setting up the Virtual Environment

### Windows

1. Navigate to the backend directory:
   ```bash
   cd Ducky/server/
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
   or
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   ```bash
   venv\Scripts\activate
   ```

### macOS/Linux

1. Navigate to the backend directory:
   ```bash
   cd Ducky/server/
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
3. Activate the virtual environment:
   ```bash
   source venv/bin/activate
   ```

## Leaving the Virtual Environment

To deactivate the virtual environment, type the following in your terminal:

```bash
deactivate
```

## Installing Dependencies

After activating the virtual environment, install all dependencies:

```bash
pip install -r requirements.txt
```

## Starting the Server

To active the server you may run the following command:

```bash
npm run server
```
