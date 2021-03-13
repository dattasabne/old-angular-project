import { BranchNode } from 'src/app/website/model/branch.node';

export interface FunctionReffernceModel{
  validate:(branches:BranchNode[])=>boolean;
}
