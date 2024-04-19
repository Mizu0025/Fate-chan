{
  description = "Fate-chan IRC bot";

  inputs = { flake-utils.url = "github:numtide/flake-utils"; };

  inputs = {
    dream2nix.url = "github:nix-community/dream2nix";
    nixpkgs.follows = "dream2nix/nixpkgs";
  };

  outputs = inputs@{ self, dream2nix, nixpkgs, ... }:
    let
      system = "x86_64-linux";
      fate-chan = dream2nix.lib.evalModules {
        packageSets.nixpkgs =
          inputs.dream2nix.inputs.nixpkgs.legacyPackages.${system};
        modules = [
          ./default.nix
          {
            paths.projectRoot = ./.;
            # can be changed to ".git" or "flake.nix" to get rid of .project-root
            paths.projectRootFile = "flake.nix";
            paths.package = ./.;
          }
        ];
      };
    in {
      # All packages defined in ./packages/<name> are automatically added to the flake outputs
      # e.g., 'packages/hello/default.nix' becomes '.#packages.hello'
      packages.${system} = {
        default = fate-chan;
        fate-chan = fate-chan;
      };
    };
}