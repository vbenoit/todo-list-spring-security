package security.repository;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.repository.support.SimpleJpaRepository;
import org.springframework.stereotype.Repository;

import security.model.User;


@Repository("UserRepo")
public class UserRepositoryImpl extends SimpleJpaRepository<User, Long> implements UserRepository {

	private CriteriaBuilder cb;
    private EntityManager em;
	
	public UserRepositoryImpl(EntityManager em) {
		super(User.class, em);
		this.em = em;
        this.cb = em.getCriteriaBuilder();
	}

	@Override
	public User findByUsername(String username) {
		
		CriteriaQuery<User> cq = this.cb.createQuery(User.class);
        Root<User> root = cq.from(User.class);
        
        cq.where(this.cb.equal(root.get("username"), username));
		
		return this.em.createQuery(cq.distinct(true)).getResultList().get(0);
		
	}
}