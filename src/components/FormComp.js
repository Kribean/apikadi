const FormComp = ({nameShop,setNameShop,setIsShopValid})=>{

    return(
        <div className="flex flex-col justify-center items-center bg-zinc-200 h-screen gap-4">
            <input value={nameShop} onChange={(e)=>{setNameShop(e.target.value)}} type="text" placeholder="Nom du magazin" className="input input-bordered w-full max-w-xs" />
            <button className="btn btn-success" onClick={()=>{setIsShopValid(true)}}>Valider</button>
        </div>
    )
}

export default FormComp;