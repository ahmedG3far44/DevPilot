import type { RepositoryCardData } from '@/types/repository'
import { createContext, useContext, type Dispatch, type SetStateAction}from 'react'



export interface ReposContextType{
	repos: RepositoryCardData[],
	setRepos: Dispatch<SetStateAction<RepositoryCardData[]>>;
	handleLoginWithGithub:()=> Promise<{ success: boolean; message: string }> ;
	logout:()=>void;
	handleGetRepos:()=> Promise<any>;
	token:string | null;
	pending:boolean;
	error: string | null
}

export const ReposContext = createContext<ReposContextType>({
	repos:[],
	setRepos: (_value: SetStateAction<RepositoryCardData[]>) => {},
	handleLoginWithGithub:()=> Promise.resolve({ success: false, message: "" }) ,
	logout:()=> {},
	handleGetRepos:()=>Promise.resolve(),
	pending:false,
	token:null,
	error:null,
})


export const useRepos = ()=> useContext(ReposContext);