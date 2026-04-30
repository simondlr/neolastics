import { gql } from "@apollo/client";

export const NEOLASTICS_QUERY = gql`
  query Neolastics {
    neolastics(orderBy: created, orderDirection: desc, first: 5) {
      id
      created
      pricePaid
      owner {
        id
      }
    }
    curve(id: "1") {
      totalSupply
      totalEverMinted
      totalEverPaid
      reserve
      mintPrice
      burnPrice
    }
  }
`;

export const NEOLASTIC_QUERY = gql`
  query Neolastic($id: String!) {
    neolastic(id: $id) {
      id
      created
      pricePaid
      owner {
        id
      }
    }
    curve(id: "1") {
      burnPrice
    }
  }
`;

export const GALLERY_QUERY = gql`
  query Gallery($ownerId: String!) {
    collector(id: $ownerId) {
      id
      neolastics(orderBy: created, orderDirection: desc) {
        id
        created
      }
    }
  }
`;

export interface NeolasticListItem {
  id: string;
  created: string;
  pricePaid: string;
  owner: { id: string };
}

export interface CurveData {
  totalSupply: string;
  totalEverMinted: string;
  totalEverPaid: string;
  reserve: string;
  mintPrice: string;
  burnPrice: string;
}

export interface NeolasticsQueryData {
  neolastics: NeolasticListItem[];
  curve: CurveData;
}

export interface NeolasticQueryData {
  neolastic: {
    id: string;
    created: string;
    pricePaid: string;
    owner: { id: string };
  } | null;
  curve: { burnPrice: string };
}

export interface GalleryQueryData {
  collector: {
    id: string;
    neolastics: Array<{ id: string; created: string }>;
  } | null;
}
