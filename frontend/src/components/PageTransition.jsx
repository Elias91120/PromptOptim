const PageTransition = ({ children }) => {
    return (
        <div className="animate-fade-in">
            {children}
        </div>
    );
};

export default PageTransition;
