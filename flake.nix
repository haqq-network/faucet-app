{
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs/nixpkgs-unstable;

    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    flake-compat = {
      url = "github:edolstra/flake-compat";
      inputs.nixpkgs.follows = "nixpkgs";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, flake-utils, ... }@inputs:
    flake-utils .lib.eachDefaultSystem (system:
      let
        inherit (pkgs) lib stdenv mkShell;
        inherit (pkgs.darwin.apple_sdk.frameworks) SystemConfiguration;

        overlays = [
        ];

        pkgs = import nixpkgs {
          inherit system overlays;
        };


        buildInputs = with pkgs; [
          # Build
          pkg-config
          nodejs
          yarn

          werf
        ] ++ lib.optional (stdenv.isDarwin) [
          # Build
          libiconv
          SystemConfiguration
        ];
      in
      rec {
        packages = {
          # # nix build .#haqq-slack-bot
          # haqq-slack-bot = callPackage nix/packages/haqq-slack-bot.nix {
          #   inherit self pkgs nix-filter cargoToml naerskPlatform buildInputs;
          #   release = true;
          # };

          # # nix build .#haqq-slack-bot-zig-x86-64-unknown-linux-musl
          # haqq-slack-bot-zig-x86-64-unknown-linux-musl = callPackage nix/packages/haqq-slack-bot-zig.nix {
          #   inherit self pkgs nix-filter cargoToml naerskPlatform buildInputs;

          #   release = true;
          #   target = "x86_64-unknown-linux-musl";
          # };

          # # nix build .#haqq-slack-bot-zig-aarch64-unknown-linux-gnu
          # haqq-slack-bot-zig-aarch64-unknown-linux-gnu = callPackage nix/packages/haqq-slack-bot-zig.nix {
          #   inherit self pkgs nix-filter cargoToml naerskPlatform buildInputs;

          #   release = true;
          #   target = "aarch64-unknown-linux-gnu";
          # };

          # # nix build .#haqq-slack-bot-image
          # haqq-slack-bot-image = callPackage nix/packages/haqq-slack-bot-image.nix {
          #   inherit pkgs packages cargoToml buildInputs;
          # };
        };

        devShell = mkShell {
          inherit buildInputs;

          WERF_PLATFORM="linux/amd64";
        };
      }
    );
}
