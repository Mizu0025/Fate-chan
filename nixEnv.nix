{pkgs ? import <nixpkgs> {}}:

pkgs.mkShell {
    buildInputs = with pkgs; [
        nodejs_21
        nodePackages.npm
    ];
}