import subprocess
from dotenv import load_dotenv
import os
import random

load_dotenv()  # Load environment variables from .env file

OPENAI_TOKEN = os.getenv('OPENAI_TOKEN')
MOON_V1_CLI_DIR = os.getenv('MOON_V1_CLI_DIR')
def check_result_file_exists(filepath):
    assert os.path.isfile(filepath), f"Error: File '{filepath}' does not exist."
def assert_run_benchmark_outcome(output_lines):
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]

    assert "File written".replace(" ", "") in output_lines
    assert "successfully at:".replace(" ", "") in output_lines
    assert "data/results/my-benchm".replace(" ", "") in output_lines
    assert "successfully created with".replace(" ", "") in output_lines

def assert_run_red_teaming_outcome(output_lines):
    output_lines = [line.replace(" ", "") for line in output_lines if line.strip()]
    assert "File written".replace(" ", "") in output_lines
    assert "successfully at:".replace(" ", "") in output_lines
    assert "data/results/test_run_".replace(" ", "") in output_lines
    assert "successfully created with".replace(" ", "") in output_lines
    assert "run_id:".replace(" ", "") in output_lines
def test_cli_smoke_test():
    # Smoke Test for Benchmarking Test Command
    # Generate a random number between 0 and 999,999,999 (inclusive)
    random_number = int(random.random() * 1000000000)
    dataset_module = "s3://s3-aiss-moonshot-dev-app-lite/data/dataset-mini/prompt_injection_payload_splitting"
    connector_name = "my-gpt4o-mini"
    nameOfRunnerName = "my-benchmarking-" + connector_name + "-" + dataset_module + "-" + str(random_number)
    metric_module = "refusal_adapter"

    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot benchmark " + nameOfRunnerName + " " + dataset_module + " " + metric_module + " " + connector_name + ""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    print('Output ERR:', stderr)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Assert Results
    assert_run_benchmark_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")

    # Smoke Test for Scan Test Command
    nameOfRunnerName = "test_run_hallucination" + str(random_number)
    attack_module = "hallucination"
    metric_module = "refusal_adapter"
    connector_name = "my-gpt4o-mini"
    commands = [
        "export OPENAI_API_KEY=" + OPENAI_TOKEN,
        "poetry run moonshot scan " + nameOfRunnerName + " "+attack_module+" "+metric_module+" "+connector_name+""
    ]
    # Join commands with '&&' to ensure the next runs only if the previous succeeds
    full_command = "&&".join(commands)
    print(f"Running combined command: {full_command}")

    process = subprocess.Popen(
        full_command,
        shell=True,  # Allows for complex shell commands
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        text=True,
        cwd=str(MOON_V1_CLI_DIR),
    )
    print('Path:', str(MOON_V1_CLI_DIR))
    # Ensure process.stdin is not None
    if process.stdin is None:
        raise RuntimeError("Failed to create stdin for the subprocess")

    # Capture the output and errors
    stdout, stderr = process.communicate()

    print('Output:', stdout)
    # Split the output into lines
    output_lines = stdout.splitlines()

    # Assert Results
    assert_run_red_teaming_outcome(output_lines)
    check_result_file_exists(MOON_V1_CLI_DIR + "/data/results/" + nameOfRunnerName + ".json")