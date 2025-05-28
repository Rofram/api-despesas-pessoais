let
  unstableNixpkgs = fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-unstable.tar.gz";
  pkgs = import unstableNixpkgs { config = {}; overlays = []; };
in

pkgs.mkShell {
  buildInputs = with pkgs; [
    nodePackages_latest.prisma
  ];
  env = {
    PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
    PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
    PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
  };
}
