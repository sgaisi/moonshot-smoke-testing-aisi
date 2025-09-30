import pytest
import subprocess
from dotenv import load_dotenv
import os

import random

load_dotenv()  # Load environment variables from .env file

OPENAI_URI = os.getenv('OPENAI_URI')
OPENAI_TOKEN = os.getenv('OPENAI_TOKEN')
CLI_DIR = os.getenv('CLI_DIR')
COMMAND = (
        'python -m moonshot cli interactive'
    )

assert OPENAI_TOKEN and CLI_DIR, "Missing required environment variables"

def test_cli_benchmark():
    process = subprocess.Popen(
        COMMAND,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(CLI_DIR),
    )
    print('Path:', str(CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Update Endpoints
    command = 'update_endpoint openai-gpt4o "[(\'name\', \'OpenAI GPT4o\'), (\'uri\', \''+str(OPENAI_URI)+'\'), (\'token\', \''+str(OPENAI_TOKEN)+'\'), (\'params\', {\'timeout\': 300, \'allow_retries\': True, \'num_of_retries\': 3, \'temperature\': 0.5, \'model\': \'gpt-4o\'})]"\n'
    # print('Command:', command)
    process.stdin.write(command)
    process.stdin.flush()

    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    nameOfRunnerName = "my benchmarking runner " + str(random_number)
    command = 'run_cookbook "' + nameOfRunnerName + '" "[\'chinese-safety-cookbook\']" "[\'openai-gpt4o\']" -n 1 -r 1 -s "You are an intelligent AI"\n'
    process.stdin.write(command)
    process.stdin.flush()

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Get the last line of the output
    last_line = output_lines[-16]
    print('=========================Output Last Line:', last_line)
    assert last_line.replace(" ", "") == "CookbookResult"

def test_cli_red_teaming():
    process = subprocess.Popen(
        COMMAND,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(CLI_DIR),
    )

    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    nameOfRunnerFileName = "my-red-teaming-runner-" + str(random_number)

    file_path = str(CLI_DIR)+"/moonshot-data-aisi/generated-outputs/runners/"+nameOfRunnerFileName+".json"

    command = 'new_session '+nameOfRunnerFileName+' -e "[\'openai-gpt4o\']" -c add_previous_prompt -p mmlu \n'
    process.stdin.write(command)
    process.stdin.flush()

    process.stdin.write('run_attack_module charswap_attack "this is my prompt"\n')
    process.stdin.flush()

    # # Capture the output and errors
    # stdout, stderr = process.communicate()

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)

    if os.path.exists(file_path):
        print(f"File exists: {file_path}")
        assert True


    else:
        print(f"File does not exist: {file_path}")
        pytest.fail()

def test_cli_agentic():
    process = subprocess.Popen(
        COMMAND,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(CLI_DIR),
    )

    print('Path:', str(CLI_DIR))
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Update Endpoint
    command = 'update_endpoint openai-gpt4o "[(\'name\', \'OpenAI GPT4o\'), (\'uri\', \''+str(OPENAI_URI)+'\'), (\'token\', \''+str(OPENAI_TOKEN)+'\'), (\'params\', {\'timeout\': 300, \'allow_retries\': True, \'num_of_retries\': 3, \'temperature\': 0.5, \'model\': \'gpt-4o\'})]"\n'
    # print('Command:', command)
    process.stdin.write(command)
    process.stdin.flush()

    # Run agentic cookbook
    random_number = int(random.random() * 1000000000)
    nameOfRunnerName = "smoke test agentic runner " + str(random_number)
    command = 'run_cookbook "' + nameOfRunnerName + '" "[\'AISI-JT3-en\']" "[\'openai-gpt4o\']" -l agentic -n 1 -r 1 -s ""\n'
    process.stdin.write(command)
    process.stdin.flush()

    # Capture the output and errors
    stdout, stderr = process.communicate()
    print('Output:', stdout)

    # Check that results were successfully created
    output_lines = stdout.splitlines()
    last_line = output_lines[-20]
    print('=========================Output Last Line:', last_line)
    assert last_line.replace(" ", "") == "CookbookResult"
