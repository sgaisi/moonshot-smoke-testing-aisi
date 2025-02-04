# Moonshot Smoke Automation Test

## Overview

This repository contains smoke tests for [Project Moonshot](https://github.com/aiverify-foundation/moonshot), a toolkit designed to evaluate and red-team Large Language Model (LLM) applications. The integration tests ensure that various components of Moonshot work seamlessly together, maintaining the toolkit's reliability and performance.

## Prerequisites

Before running the integration tests, ensure you have the following installed:

- **Python**: Version 3.11 or later
- **Node.js**: Version 20.11.1 LTS or later (if testing the Web UI)
- **Git**: For version control

## Installation

**Clone the Repository**:

   ```bash
   git clone https://github.com/aiverify-foundation/moonshot-smoke-testing.git
   cd moonshot-smoke-testing
   ```

## Running the CLI Smoke Test

To execute the smoke tests:

1. **Set Up the Virtual Environment**:

   It's recommended to use a virtual environment to manage dependencies:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

2. **Install Dependencies**:

   Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```

   Install the required Node packages:

   ```bash
   npm install
   ```
   
3. **Setup Env File**:

   Create a .env file:

   ```bash
   touch .env
   ```

   Open the .env file in a text editor and define your environment variables:
   ```bash
  # .env
  AZURE_OPENAI_URI = 
  AZURE_OPENAI_TOKEN = 
  ADDITIONAL_PARAMETERS = '{      "timeout": 300, "max_attempts": 3,   "temperature": 0.5 }'
  MOONSHOT_URL = localhost
  MOONSHOT_PORT_NUMBER = 3000
  CLI_DIR = ''# Path of Moonshot Library
   ```

1. **Navigate to the Test Directory**:

   ```bash
   cd tests
   ```

4. **Run Tests**:

   Use the following command to run Cli smoke tests:

   ```bash
   pytest
   ```

   Use the following command to run UI smoke tests:

   ```bash
   npx playwright test
   ```

## Directory Structure

A brief overview of the repository structure:

```
moonshot-integration-testing/         # Integration test cases
├── tests/                   
│   ├── test_cli.py                   # Smoke Test for the Moonshot CLI
│   ├── smoke-test.spec.ts            # Smoke Test for the Moonshot UI
│   └── 
├── .gitignore
├── README.md                # Project documentation
└── LICENSE                  # License information
```

## Contributing

We welcome contributions to enhance the integration tests for Moonshot. To contribute:

1. **Fork the Repository**: Click the "Fork" button at the top right of this page.
2. **Create a New Branch**: Use a descriptive name for your branch.
3. **Make Your Changes**: Implement your improvements or fixes.
4. **Submit a Pull Request**: Provide a clear description of your changes.

Please ensure that your contributions align with the project's coding standards and pass all existing tests.

## License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to all contributors and the AI Verify Foundation for their support in developing and maintaining the Moonshot project.
```

This template provides a comprehensive guide for users and contributors, covering installation, usage, and contribution guidelines. Feel free to customize it further based on the specific details and requirements of your project. 
