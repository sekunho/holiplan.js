{
  description = "A holiday planner";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages."${system}";
    in {
      devShells."${system}".default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs
          nodePackages.typescript
          nodePackages.typescript-language-server


          # Database
          sqitchPg
          perl534Packages.TAPParserSourceHandlerpgTAP
        ];
      };

    };
}
