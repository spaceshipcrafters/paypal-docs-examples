#!/bin/bash

# Default folders to open inside VS Code Dev Container
FOLDERS_DEFAULT=()

# Service provided via command line argument
FOLDERS=(${1:-${FOLDERS_DEFAULT[@]}})

# Workspace folder within the container
WORKSPACE_FOLDER=code

# Open in code with devcontainer function
open_in_code_with_devcontainer () {
    local FOLDER=$1

    FOLDER_PATH="$(pwd)/$FOLDER"
    FOLDER_PATH_HASH=$(printf "%s" "$FOLDER_PATH" | xxd -p | tr -d '\n')
    FOLDER_URI="vscode-remote://dev-container+$FOLDER_PATH_HASH/$WORKSPACE_FOLDER"

    echo "Opening $FOLDER_PATH in code..."
    echo "Path hash: $FOLDER_PATH_HASH"
    echo "Folder URI: $FOLDER_URI"

    code --folder-uri $FOLDER_URI

    echo "Done"
}

for FOLDER in "${FOLDERS[@]}"; do
    open_in_code_with_devcontainer $FOLDER
done
