{ lib, config, dream2nix, ... }: {
  imports = [
    dream2nix.modules.dream2nix.nodejs-package-lock-v3
    dream2nix.modules.dream2nix.nodejs-granular-v3
  ];

  mkDerivation = {
    src = ./.;
    checkPhase = "npm test";
  };

  deps = { nixpkgs, ... }: { inherit (nixpkgs) fetchFromGitHub stdenv; };

  nodejs-package-lock-v3 = { packageLockFile = ./package-lock.json; };

  name = "fate-chan";
  version = "1.0.0";
}
