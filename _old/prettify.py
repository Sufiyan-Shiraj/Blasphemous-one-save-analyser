#!/usr/bin/env python3

from argparse import ArgumentParser
from base64 import b64decode
from pathlib import Path
import json
import sys

parser = ArgumentParser()
parser.add_argument("input")
parser.add_argument("output")


def main() -> int:
    args = parser.parse_args()
    input = Path(args.input)
    output = Path(args.output)

    print(f"Loading {input}")
    data = b64decode(input.read_text())
    obj = json.loads(data.decode())
    print(f"Saving {output}")
    with output.open("w") as fd:
        json.dump(obj, fd, indent=2)
    return 0


if __name__ == "__main__":
    sys.exit(main())
